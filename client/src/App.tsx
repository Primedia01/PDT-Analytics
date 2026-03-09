import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./lib/auth";

import Dashboard from "@/pages/Dashboard";
import Explorer from "@/pages/Explorer";
import Analytics from "@/pages/Analytics";
import Assets from "@/pages/Assets";
import Campaign from "@/pages/Campaign";
import Marketplace from "@/pages/Marketplace";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AuthProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard}/>
          <Route path="/explorer" component={Explorer}/>
          <Route path="/analytics" component={Analytics}/>
          <Route path="/assets" component={Assets}/>
          <Route path="/campaign" component={Campaign}/>
          <Route path="/marketplace" component={Marketplace}/>
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </AuthProvider>
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
