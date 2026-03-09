import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";

import Dashboard from "@/pages/Dashboard";
import Explorer from "@/pages/Explorer";
import Analytics from "@/pages/Analytics";
import Assets from "@/pages/Assets";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard}/>
        <Route path="/explorer" component={Explorer}/>
        <Route path="/analytics" component={Analytics}/>
        <Route path="/assets" component={Assets}/>
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
