"use client";
import { cn } from '@/lib/utils';
import {type ColorResult, SketchPicker} from 'react-color';
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ChevronDownIcon, HighlighterIcon, ImagePlusIcon, Italic, Link2Icon, ListCollapseIcon, ListIcon, ListTodoIcon, LucideIcon, MessageSquarePlusIcon, MinusIcon, PlusIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SearchIcon, SpellCheckIcon, Underline, Undo2Icon, UploadIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useEditorStore } from '@/store/use-editor-store';
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
 } from '@/components/ui/dropdown-menu';
 import { type Level } from '@tiptap/extension-heading';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';

 const LineHeightButton = ()=>{
  const {editor} = useEditorStore();
  const lineHeight = [
    {
      label: "Default",
      value: "normal"
    },
    {
      label: "Single",
      value: "1"
    },
    {
      label: "1.15",
      value: "1.15"
    },
    {
      label: "1.5",
      value: "1.5"
    },
    {
      label: "Double",
      value: "2"
    }
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
          <ListCollapseIcon className='size-4'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
        {
          lineHeight.map(({label , value })=>(
            <button 
            key={value}
            onClick={()=>{
              editor?.chain().focus().setLineHeight(value).run();
            }}
            className={cn("flex items-center gap--x-2 px-2 py-1   rounded-sm hover:bg-neutral-200/80 px",
              editor?.getAttributes("paragraph").lineHeight == value &&"bg-neutral-200/80"
            )}
            >
              <span className='text-sm'>{label}</span>
            </button>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const FontSizeButton = () => {
  const { editor } = useEditorStore();
  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";
  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
    
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    console.log("Incrementing font size to:", newSize);
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    console.log("Decrementing font size to:", newSize);
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
        onClick={decrement}
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent cursor-text"
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
        >
          {currentFontSize}
        </button>
      )}
      <button
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
        onClick={increment}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

 const ImageButton = ()=>{
  const {editor} = useEditorStore();
  const [isDialogOpen,setDialogOpen] = useState(false);
  const [imageUrl,setImageUrl] = useState("");

  const onChange = (src:string)=>{
    editor?.chain().focus().setImage({src}).run();
  }
  const onUpload =()=>{
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e)=>{
      const file = (e.target as HTMLInputElement).files?.[0];
      if(file){
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    }
    input.click();
  };

  const handleImageUrl = ()=>{
    if(imageUrl){
      onChange(imageUrl);
      setImageUrl("");
      setDialogOpen(false);
    }
  }
  return (
    <>
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
          <span className='text-xs'>
            <ImagePlusIcon className='size-4'/>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-2.5 flex flex-col  gap-y-2'>
        <DropdownMenuItem onClick={onUpload}>
          <UploadIcon className='size-4 mr-2'/>
          Upload
        </DropdownMenuItem>
        <DropdownMenuItem onClick={()=>setDialogOpen(true)}>
          <SearchIcon className='size-4 mr-2'/>
          Pase Image Url
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image url</DialogTitle>
        </DialogHeader>
        <input
        placeholder='insert image url'
        value={imageUrl}
        onChange={(e)=>setImageUrl(e.target.value)}
        onKeyDown={
          (e)=>{
            if(e.key === "Enter"){
              handleImageUrl();
            }
          }
        }
        />
        <DialogFooter>
          <Button 
          onClick={handleImageUrl}
          >
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </>
  )
 }
 

const ListButton = ()=>{
  const {editor} = useEditorStore();
  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: ()=>editor?.isActive("bulletList"),
      onClick: ()=>editor?.chain().focus().toggleBulletList().run()
    },
    {
      label: "Numbered List",
      icon: ListIcon,
      isActive: ()=>editor?.isActive("orderedList"),
      onClick: ()=>editor?.chain().focus().toggleOrderedList().run()
    },
    {
      label: "Ordered List",
      icon: ListTodoIcon,
      isActive: ()=>editor?.isActive("orderedList"),
      onClick: ()=>editor?.chain().focus().toggleOrderedList().run()
    },
    {
      label: "Task List",
      icon: ListTodoIcon,
      isActive: ()=>editor?.isActive("taskList"),
      onClick: ()=>editor?.chain().focus().toggleTaskList().run()
    }
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
          <AlignLeftIcon className='size-4'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
        {
          lists.map(({label ,onClick , icon:Icon,isActive})=>(
            <button 
            key={label}
            onClick={onClick}
            className={cn("flex items-center gap--x-2 px-2 py-1   rounded-sm hover:bg-neutral-200/80 px",
              isActive() && "bg-neutral-200/80"
            )}
            >
              <Icon className='size-4'/>
              <span className='text-sm'>{label}</span>
            </button>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
 const AlignButton = ()=>{
  const {editor} = useEditorStore();
  const aliments = [
    {
      label: "Left",
      value: "left",
      icon: AlignLeftIcon
    },
    {
      label: "Center",
      value: "center",
      icon: AlignCenterIcon
    },
    {
      label: "Right",
      value: "right",
      icon: AlignRightIcon
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon
    }
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
          <AlignLeftIcon className='size-4'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
        {
          aliments.map(({label , value , icon:Icon})=>(
            <button 
            key={value}
            onClick={()=>{
              editor?.chain().focus().setTextAlign(value).run();
            }}
            className={cn("flex items-center gap--x-2 px-2 py-1   rounded-sm hover:bg-neutral-200/80 px",
              editor?.isActive({textAlign:value}) &&"bg-neutral-200/80"
            )}
            >
              <Icon className='size-4'/>
              <span className='text-sm'>{label}</span>
            </button>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
 const LinkButton = ()=>{
  const {editor} = useEditorStore();
  const [value,setValue] = useState('');

  const onClick = (href:string)=>{
    
      editor?.chain().focus().extendMarkRange("link").setLink({href}).run();
      setValue("");
  }
  return (
    <DropdownMenu onOpenChange={(open)=>{
      if(open){
        setValue(editor?.getAttributes('link').href || "")
      }
    }}>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
          <span className='text-xs'>
            <Link2Icon className='size-4'/>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-2.5 flex items-center gap-y-2'>
        <input 
        type="text"
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        placeholder='https://example.com'
        className='border border-neutral-300 rounded-md p-2'
        />
        <button 
        onClick={()=>onClick(value)}
        className='bg-blue-500 text-white rounded-md p-2'
        >
          Add Link
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  )

 }
const HighLightButton = ()=>{
  const {editor} = useEditorStore();
  const value = editor?.getAttributes("highlight").color || "#ffffff";
  const onChange = (color:ColorResult)=>{
    editor?.chain().focus().setHighlight({color:color.hex}).run();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
          <HighlighterIcon className='size-4'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-0'>
        <SketchPicker
          color={value}
          onChange={onChange}
          
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const TextColorButton = ()=>{
  const {editor} = useEditorStore();
  const value = editor?.getAttributes("textStyle").color || "#000000";
  const onChange = (color:ColorResult)=>{
    editor?.chain().focus().setColor(color.hex).run();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden test-sm">
          <span className='text-xs'>
            A
          </span>
            <div className='w-full h-0.5 rounded-full' style={{backgroundColor:value}}/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-0'>
        <SketchPicker
          color={value}
          onChange={onChange}
          
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
      <Separator orientation="vertical"  className='h-6 bg-neutral-500'/>
      <FontFamilyButton/>
      <Separator orientation="vertical"  className='h-6 bg-neutral-500'/>
      
      <HeadingLevelButton/>
      <Separator orientation="vertical"  className='h-6 bg-neutral-500'/>
      <FontSizeButton/>
      <Separator orientation="vertical"  className='h-6 bg-neutral-500'/>
      {
        sections[1].map((item)=>(
          <ToolbarButton key={item.label} {...item}/>
          ))
      }
      <TextColorButton/>
      <HighLightButton/>
      <Separator orientation='vertical' className='h-6 bg-neutral-500'/>
      <LinkButton/>
      <ImageButton/>
      <Separator orientation="vertical"  className='h-6 bg-neutral-500'/>
      <AlignButton/>
      <LineHeightButton/>
      <ListButton/>
      <Separator orientation="vertical"  className='h-6 bg-neutral-500'/>
      {
        sections[2].map((item)=>(
          <ToolbarButton key={item.label} {...item}/>
        ))
      }

    </div>
  )
}

export default Toolbar;