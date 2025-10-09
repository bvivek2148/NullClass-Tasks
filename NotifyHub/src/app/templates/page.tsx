import TemplatesManager from "@/components/templates/TemplatesManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Code2, Sparkles } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-background border-b">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-16">
          <div className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit px-3 py-1">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Template Engine & i18n
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Notification Templates
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Manage versioned notification templates with multi-language support and dynamic variable substitution.
              Create personalized content for email, SMS, and push notifications.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border-2 bg-card p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-blue-500/10">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Multi-Channel</h3>
            </div>
            <p className="text-xs text-muted-foreground">Email, SMS, and Push support</p>
          </div>
          
          <div className="rounded-lg border-2 bg-card p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-green-500/10">
                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-sm">Localization</h3>
            </div>
            <p className="text-xs text-muted-foreground">Multi-language templates</p>
          </div>
          
          <div className="rounded-lg border-2 bg-card p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-purple-500/10">
                <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">Dynamic Variables</h3>
            </div>
            <p className="text-xs text-muted-foreground">Variable substitution & logic</p>
          </div>
          
          <div className="rounded-lg border-2 bg-card p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-orange-500/10">
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-sm">Versioning</h3>
            </div>
            <p className="text-xs text-muted-foreground">Track template changes</p>
          </div>
        </div>

        <Alert className="border-2">
          <FileText className="h-4 w-4" />
          <AlertTitle>Template System Features</AlertTitle>
          <AlertDescription className="mt-2 space-y-1 text-sm">
            <p>• <strong>Variable substitution:</strong> Use {`{{variable}}`} and {`{{object.property}}`} for dynamic content</p>
            <p>• <strong>Conditional logic:</strong> {`{{#if condition}}...{{/if}}`} blocks for conditional rendering</p>
            <p>• <strong>Loops:</strong> {`{{#each array}}...{{/each}}`} for iterating over lists</p>
            <p>• <strong>HTML escaping:</strong> Automatic security protection for user-generated content</p>
            <p>• <strong>Locale fallback:</strong> Automatic fallback to default language when translation missing</p>
          </AlertDescription>
        </Alert>

        <TemplatesManager />
      </main>
    </div>
  );
}