package com.namma.api.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.namma.api.services.AbstractUserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private AbstractUserDetailsService abstractUserDetailsService;
 
    @Autowired
    private  JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       final String requestTokenHeader= request.getHeader("Authorization");
        String username=null;
        String jwtToken=null;
        if(requestTokenHeader!=null&&requestTokenHeader.startsWith("Bearer")){
             jwtToken=requestTokenHeader.substring(7);
             try {
                 username=jwtUtil.extractUsername(jwtToken);
             }catch (ExpiredJwtException ex){
                 ex.printStackTrace();
                 System.out.println("Token Expire");
             }catch (Exception ex){
                 ex.printStackTrace();
                 System.out.println("error");
             }


        }else{
            System.out.println("Invalid Token ,not start with Bearer");
        }

        if(username!=null&& SecurityContextHolder.getContext().getAuthentication()==null){
          final UserDetails userDetails = abstractUserDetailsService.loadUserByUsername(username);
          if(jwtUtil.validateToken(jwtToken,userDetails)){
              UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
              usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
              SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
          }
        }else{
            System.out.println("Invalid Token");
        }
      filterChain.doFilter(request,response);
    }
}

