"use client";
import { cn } from '@/lib/utils';
import { BoldIcon, ChevronDownIcon, Italic, List, ListTodoIcon, LucideIcon, MessageSquarePlusIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SpellCheckIcon, Underline, Undo2Icon } from 'lucide-react';
import React from 'react'
import { useEditorStore } from '@/store/use-editor-store';
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
 } from '@/components/ui/dropdown-menu';
 import { type Level } from '@tiptap/extension-heading';
 
const HeadingLevelButton = ()=>{
  const {editor} = useEditorStore();

  const heading = [
    {level : "Normal text" , value:0, fontSize:"16px"},
    {level : "Heading 1" , value:1, fontSize:"32px"},
    {level : "Heading 2" , value:2, fontSize:"24px"},
    {level : "Heading 3" , value:3, fontSize:"20px"},
    {level : "Heading 4" , value:4, fontSize:"18px"},
    {level : "Heading 5" , value:5, fontSize:"16px"},
  ]
  const getCurrentHeading = ()=>{
    
    for(let level =1;level <=5;level++){
      if(editor?.isActive("heading",{level})){
        return `Heading ${level}`
      }
    }
    return "Normal text";
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
        <span className='truncate'>
          {getCurrentHeading()}
        </span>
        <ChevronDownIcon className='ml-2 size-4 shrink-0'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
        {
          heading.map(({level , value , fontSize})=>(
            <button 
            key={value}

            value={value}
            onClick={()=>{
                if(value === 0){
                  editor?.chain().focus().setParagraph().run();
                }else{
                editor?.chain().focus().toggleHeading({level:value as Level}).run();
                  
                }
              }
              }
            className={cn("flex items-center gap--x-2 px-2 py-1   rounded-sm hover:bg-neutral-200/80 px",
             (value === 0 && !editor?.isActive("heading") ) || editor?.isActive("heading",{level : value})&&"bg-neutral-200/80"
            )}
            style={{fontSize}}
            >
              {level}
            </button>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
const FontFamilyButton = ()=>{
  const {editor} = useEditorStore();
   const fonts =[
    {
      label: "Arial" ,value: "Arial"
    },
    {
    label: "Times New Roman" ,value: "Times New Roman"
    },
    {
    label: "Courier New" ,value: "Courier New"
    },
    {
    label: "Georgia" ,value: "Georgia"
    },
    {
      label: "Verdana" ,value: "Verdana"
    }
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <span className='truncate'>
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className='ml-2 size-4 shrink-0'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
        {
          fonts.map(({label , value})=>(
            <button 
            onClick={()=>editor?.chain().focus().setFontFamily(value).run()}
            key={value}
            className={cn("flex items-center gap--x-2 px-2 py-1   rounded-sm hover:bg-neutral-200/80 px",
              editor?.getAttributes("textStyle").fontFamily === value  &&"bg-neutral-200/80"
            )}
            style={{fontFamily:value}}
            >
              <span className='text-sm'>{label}</span>
            </button>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


interface ToolbarButtonProps {
  onClick?: ()=>void;
  isActive?:boolean;
  icon:LucideIcon;
}

const ToolbarButton =({
  onClick,
  isActive,
  icon : Icon
}:ToolbarButtonProps)=>{
  return (
    <button 
    onClick={onClick}
    className={cn("text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
      isActive && "bg-neutral-200/80"
    )}
    >
      <Icon className='size-4'/>
    </button>
  )
}

const Toolbar = () => {
  const { editor } = useEditorStore();

  
  const sections :{
    label:string,
    icon:LucideIcon,
    onClick:()=>void,
    isActive?: boolean
    }[][] = [
      [
        {
          label: 'Undo',
          icon: Undo2Icon,
          onClick: ()=>editor?.chain().focus().undo().run(),
          
        },
         {
          label: 'Redo',
          icon: Redo2Icon,
          onClick: ()=>editor?.chain().focus().redo().run(),
          
        },
         {
          label: 'Print',
          icon: PrinterIcon,
          onClick: ()=>window.print(),
          
        },
        {
          label: 'Spell Check',
          icon: SpellCheckIcon,
          onClick: ()=>{
            const current  = editor?.view.dom.getAttribute("spellcheck");
            editor?.view.dom.setAttribute("spellcheck", current === "true" ? "false" :"true");
          },
          
        }
      ],
      [
        {
          label: 'Bold',
          icon: BoldIcon,
          onClick: ()=>editor?.chain().focus().toggleBold().run(),
          isActive: editor?.isActive("bold")
        },
        {
          label: 'Italic',
          icon: Italic,
          onClick: ()=>editor?.chain().focus().toggleItalic().run(),
          isActive: editor?.isActive("italic")
        },
        {
          label: 'Underline',
          icon: Underline,
          onClick: ()=>editor?.chain().focus().toggleUnderline().run(),
          isActive: editor?.isActive("underline")
        }
      ],
      [
        {
          label: 'Comment',
          icon: MessageSquarePlusIcon,
          onClick: ()=>console.log(),
          isActive:false //TODO : Enable this function later
        },
        {
          label: 'List Todo',
          icon: ListTodoIcon,
          onClick: ()=> editor?.chain().focus().toggleTaskList().run(),
          isActive: editor?.isActive("taskList"),
        },
        {
          label: 'Remove Formatting',
          icon: RemoveFormattingIcon,
          onClick: ()=> editor?.chain().focus().unsetAllMarks().run(),
        }
      ]
    ]
  return (
    <div className='bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto'>
      {
        sections[0].map((item)=>(
          <ToolbarButton key={item.label} {...item}/>
        ))
      }
      <Separator orientation="vertical"  className='h-6 bg-neutral-700'/>
      <FontFamilyButton/>
      <Separator orientation="vertical"  className='h-6 bg-neutral-700'/>
      
      <HeadingLevelButton/>
      <Separator orientation="vertical"  className='h-6 bg-neutral-700'/>
      {/* TODO : Font Size*/}
      <Separator orientation="vertical"  className='h-6 bg-neutral-700'/>
      {
        sections[1].map((item)=>(
          <ToolbarButton key={item.label} {...item}/>
          ))
      }
      {/* TODO : Text color */}
      {/* TODO : HightLight color */}
      <Separator orientation='vertical' className='h-6 bg-neutral-300'/>
      {/* TODO : Link */}
      {/* TODO : Image */}
      {/* TODO : Align */}
      {/* TODO : Line Height */}
      {/* TODO : List */}
      {
        sections[2].map((item)=>(
          <ToolbarButton key={item.label} {...item}/>
        ))
      }

    </div>
  )
}

export default Toolbar;