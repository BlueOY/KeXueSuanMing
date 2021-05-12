package com.blueoy.kexuesuanmingsys.controller;

import com.alibaba.fastjson.JSON;
import com.blueoy.kexuesuanmingsys.utils.StaticClass;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

//证明是controller层并且返回页面
@Controller
public class IndexController {

    @ResponseBody   //返回数据不返回页面
    @RequestMapping("/")
    public String index() {
        return "Hello World!";
    }

    @ResponseBody
    @RequestMapping(value = "invokeCloudFunction")
    public String invokeCloudFunction(String functionName, String param) {
        System.out.println("functionName="+functionName);
        System.out.println("param="+param);

        // 获取token
        if(StaticClass.access_token==null){
            // 如果access_token为空，则获取access_token
            StaticClass.getToken();
        }else if(StaticClass.expiresTime==null || StaticClass.expiresTime.before(new Date())){
            // 如果access_token过期，则重新获取access_token
            StaticClass.getToken();
        }
        // 访问云函数
        String res = StaticClass.cloudFunction(functionName, param);
        System.out.println("访问云函数：res="+res);
        Map<String, Object> map = JSON.parseObject(res);
        if(map.get("errcode").toString().equals("40001")){
            // 如果返回错误，则重新获取access_token
            StaticClass.getToken();
            // 访问云函数
            res = StaticClass.cloudFunction(functionName, param);
            System.out.println("第二次访问云函数：res="+res);
        }else if(map.get("errcode").equals("0")){
            // 说明调用成功
            return res;
        }
        return res;
    }

    @ResponseBody
    @RequestMapping(value = "test", method = RequestMethod.POST)
    public String test(@RequestBody Map<String, String> map) {
        System.out.println("param="+map);
        return "true";
    }

    @ResponseBody
    @RequestMapping(value = "testCharset")
    public String testCharset(String param) {
        System.out.println("param="+param);
        return param;
    }

}
