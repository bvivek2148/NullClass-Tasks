import React from 'react';
import { clsx } from 'clsx';

const SidebarContext = React.createContext();

const SidebarProvider = ({ children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SidebarContext);
  
  return (
    <div
      ref={ref}
      className={clsx(
        "flex h-full w-64 flex-col transition-all duration-300",
        !context.isOpen && "w-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("p-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("flex-1 overflow-auto", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("mb-4", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("mb-2 px-3 text-xs font-medium text-slate-500", className)}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={clsx("space-y-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={clsx(className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef(({ className, asChild, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(props.children, {
      ref,
      className: clsx(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100",
        className
      ),
      ...props
    });
  }
  
  return (
    <button
      ref={ref}
      className={clsx(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarTrigger = ({ className, ...props }) => {
  const context = React.useContext(SidebarContext);
  
  return (
    <button
      className={clsx("p-2 hover:bg-slate-100 rounded-lg", className)}
      onClick={() => context.setIsOpen(!context.isOpen)}
      {...props}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 3h12M1.5 7.5h12M1.5 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  );
};

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
};