import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Store, Shield, Globe, Zap } from "lucide-react";
import { Preview } from "./Preview";
import { PreviewError } from "@/components/theme/preview/PreviewError";
import { PreviewLoading } from "@/components/theme/preview/PreviewLoading";
import { useStorefront } from "@/hooks/useStorefront";

export default function PublicHome() {
  const navigate = useNavigate();
  const { storefrontSlug } = useParams();

  useEffect(() => {
    const checkAuth = async () => {
      // Only check auth and redirect on the root path
      if (!storefrontSlug) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        }
      }
    };
    
    checkAuth();
  }, [navigate, storefrontSlug]);

  // If we have a storefront slug, fetch the storefront and render the preview
  if (storefrontSlug) {
    console.log("Rendering storefront for slug:", storefrontSlug);
    
    const { data: storefront, isLoading, error } = useStorefront(storefrontSlug);

    if (isLoading) {
      return <PreviewLoading />;
    }

    if (error || !storefront) {
      return <PreviewError error="Store not found" />;
    }

    console.log("Found storefront:", storefront);
    return <Preview storefrontId={storefront.id} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Curately</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/login")}>
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-[980px] text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Create Beautiful Online Storefronts
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Build and manage your online presence with our powerful platform. Perfect for businesses of all sizes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 sm:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg bg-primary/10 p-4">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Custom Storefronts</h3>
            <p className="mt-2 text-muted-foreground">
              Create unique storefronts that match your brand identity
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg bg-primary/10 p-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Secure Platform</h3>
            <p className="mt-2 text-muted-foreground">
              Built with security in mind to protect your business
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg bg-primary/10 p-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Global Reach</h3>
            <p className="mt-2 text-muted-foreground">
              Reach customers anywhere with our global infrastructure
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-16 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Basic Plan */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-2xl font-semibold">Basic</h3>
            <div className="mt-4 text-4xl font-bold">$9<span className="text-lg font-normal">/mo</span></div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                1 Storefront
              </li>
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                Basic Analytics
              </li>
            </ul>
            <Button className="mt-8 w-full">Get Started</Button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-lg border bg-card p-6 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
              Popular
            </div>
            <h3 className="text-2xl font-semibold">Pro</h3>
            <div className="mt-4 text-4xl font-bold">$29<span className="text-lg font-normal">/mo</span></div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                5 Storefronts
              </li>
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                Advanced Analytics
              </li>
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                Priority Support
              </li>
            </ul>
            <Button className="mt-8 w-full">Get Started</Button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-2xl font-semibold">Enterprise</h3>
            <div className="mt-4 text-4xl font-bold">Custom</div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                Unlimited Storefronts
              </li>
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                Custom Solutions
              </li>
              <li className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                24/7 Support
              </li>
            </ul>
            <Button className="mt-8 w-full">Contact Sales</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
