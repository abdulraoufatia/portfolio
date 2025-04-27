import React from 'react';
import { motion } from 'framer-motion';
import { List, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTocProps {
  content: string;
}

export default function ArticleToc({ content }: ArticleTocProps) {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const extractedHeadings: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      extractedHeadings.push({ id, text, level });
    }

    setHeadings(extractedHeadings);
  }, [content]);

  React.useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(heading => 
        document.getElementById(heading.id)
      ).filter(Boolean);

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(element.id);
          break;
        }
      }

      if (headingElements[0] && headingElements[0].offsetTop > scrollPosition) {
        setActiveId(headings[0]?.id || null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="hidden lg:block sticky top-24 self-start glass rounded-lg p-4 max-h-[calc(100vh-120px)] overflow-y-auto"
    >
      <div className="flex items-center mb-3 text-primary">
        <List size={18} className="mr-2" />
        <h3 className="font-semibold">Table of Contents</h3>
      </div>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li 
            key={heading.id}
            className={cn(
              "transition-colors",
              heading.level === 1 ? "ml-0" : 
              heading.level === 2 ? "ml-3" : 
              "ml-6"
            )}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "flex items-center hover:text-primary transition-colors",
                activeId === heading.id 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth'
                });
                setActiveId(heading.id);
              }}
            >
              {heading.level > 1 && <ChevronRight size={14} className="mr-1 opacity-70" />}
              <span className={cn("text-sm", heading.level === 1 && "font-medium")}>
                {heading.text}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}