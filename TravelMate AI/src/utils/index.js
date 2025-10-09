export function createPageUrl(pageName) {
  const routes = {
    Home: "/",
    Routes: "/routes", 
    Chat: "/chat"
  };
  
  return routes[pageName] || "/";
}