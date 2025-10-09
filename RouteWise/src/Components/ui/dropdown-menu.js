import React from 'react';
import { clsx } from 'clsx';

const DropdownMenuContext = React.createContext();

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  
  if (asChild) {
    return React.cloneElement(children, {
      ref,
      onClick: () => context.setIsOpen(!context.isOpen),
      ...props
    });
  }
  
  return (
    <button
      ref={ref}
      className={clsx(className)}
      onClick={() => context.setIsOpen(!context.isOpen)}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ className, align = "center", children, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  
  if (!context.isOpen) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => context.setIsOpen(false)}
      />
      <div
        ref={ref}
        className={clsx(
          "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
          align === "end" && "right-0",
          align === "start" && "left-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      "w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-100 focus:bg-slate-100 focus:outline-none",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("-mx-1 my-1 h-px bg-slate-200", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};