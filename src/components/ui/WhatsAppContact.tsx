"use client";
import React from 'react';
import Link from 'next/link';

export default function WhatsAppContact() {
  return (
    <Link 
      href="https://wa.me/918055197578" 
      target="_blank" 
      rel="noreferrer"
      className="fixed bottom-8 right-8 z-[99] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.3)] hover:scale-110 hover:shadow-[0_12px_30px_rgba(37,211,102,0.4)] transition-all duration-300 group"
      aria-label="Contact us on WhatsApp"
    >
      {/* WhatsApp Icon */}
      <svg 
        width="30" 
        height="30" 
        viewBox="0 0 24 24" 
        fill="white" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.301-.15-1.767-.872-2.036-.969-.269-.099-.465-.148-.662.15-.197.297-.767.969-.94 1.168-.173.199-.347.223-.648.073-.301-.15-1.272-.469-2.422-1.496-.894-.798-1.497-1.784-1.674-2.083-.176-.299-.019-.461.13-.61.134-.133.301-.35.451-.525.15-.175.199-.299.299-.498.1-.199.05-.373-.025-.523-.075-.15-.662-1.597-.908-2.191-.24-.578-.48-.499-.662-.508-.171-.008-.367-.01-.563-.01-.197 0-.518.074-.789.373-.271.299-1.036 1.013-1.036 2.47 0 1.456 1.06 2.865 1.207 3.064.148.198 2.086 3.184 5.053 4.467.706.305 1.258.487 1.687.625.709.225 1.355.193 1.865.117.568-.085 1.767-.722 2.016-1.417.249-.695.249-1.289.174-1.416-.075-.127-.276-.199-.577-.35zM12.004 2c-5.523 0-10 4.477-10 10 0 2.11.65 4.07 1.765 5.689L2.5 21.5l3.921-1.229C7.94 21.43 9.9 22 12.004 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18c-1.877 0-3.63-.527-5.129-1.442l-.368-.224-2.333.731.745-2.274-.246-.392C3.753 15.01 3.25 13.56 3.25 12.004c0-4.832 3.922-8.754 8.754-8.754 4.832 0 8.754 3.922 8.754 8.754 0 4.832-3.922 8.754-8.754 8.754z"/>
      </svg>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-[var(--color-text)] text-[0.75rem] font-medium py-2 px-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat with us
      </span>
    </Link>
  );
}
