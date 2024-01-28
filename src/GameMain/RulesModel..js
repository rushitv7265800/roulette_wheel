import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseIcon } from "../assets/CloseIcon.svg";

export default function RulesModel(props) {
  const {
    setOpen,
    open,
    rule
  }=props
  const [rulesContent, setRulesContent] = useState('');

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (open && !event.target.closest('.rules-model')) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [open, setOpen]);
  
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch(rule);
        const content = await response.text();

        // Remove script tags to prevent potential conflicts with React
        const sanitizedContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        setRulesContent(sanitizedContent);
      } catch (error) {
        console.error('Error fetching rules:', error);
        setRulesContent('Failed to fetch rules.');
      }
    };

    if (open) {
      fetchRules();
    }
  }, [open, rule]);
  return (
    <>
     {
          open&&(
            <div className='rules-model'>
                    <div className='rulesModelBox'>
                    <div className='model-head'>
                        <h6>How To Play</h6>
                        <button className='close-icon' onClick={()=>setOpen(false)}>
                        <CloseIcon />
                        </button>
                       </div>
                       <div className='model-body'>
                       <div dangerouslySetInnerHTML={{ __html: rulesContent }} />
                       </div>
                    </div>
              </div>
          )
        }
        </>
  )
}
