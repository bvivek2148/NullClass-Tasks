import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card.js";
import { Button } from "../../Components/ui/button.js";
import { Badge } from "../../Components/ui/badge.js";
import { Switch } from "../../Components/ui/switch.js";
import { Label } from "../../Components/ui/label.js";
import { 
  Shield, 
  Download, 
  Share, 
  FileText, 
  AlertTriangle, 
  Users, 
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  Lock,
  Zap,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function EnterpriseControls({ 
  routeData, 
  onExport, 
  onOptimize, 
  isOptimizing 
}) {
  return (
    <div className="p-8 space-y-6">
      {/* Enterprise Features Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Enterprise Controls</h2>
        <p className="text-slate-600">Advanced management and optimization tools</p>
      </div>

      {/* AI Optimization Panel */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Zap className="w-5 h-5" />
            AI Route Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-slate-900">94.2%</div>
              <div className="text-xs text-slate-600">Optimization Score</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-slate-900">12min</div>
              <div className="text-xs text-slate-600">Time Saved</div>
            </div>
          </div>
          
          <Button 
            onClick={onOptimize}
            disabled={!routeData || isOptimizing}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold"
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                AI Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run AI Optimization
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Business Intelligence */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BarChart3 className="w-5 h-5" />
            Business Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {routeData ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-medium">Cost Efficiency</span>
                <Badge className="bg-green-500 text-white">Optimal</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-medium">Carbon Impact</span>
                <span className="font-bold text-slate-900">2.1 kg CO₂</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-medium">Fuel Consumption</span>
                <span className="font-bold text-slate-900">1.2L</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Calculate route to view analytics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export & Sharing */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="w-5 h-5 text-purple-600" />
            Export & Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={onExport}
              disabled={!routeData}
              variant="outline"
              className="flex items-center gap-2 font-semibold"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
            <Button 
              disabled={!routeData}
              variant="outline"
              className="flex items-center gap-2 font-semibold"
            >
              <FileText className="w-4 h-4" />
              PDF Report
            </Button>
          </div>
          
          <Button 
            disabled={!routeData}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold"
          >
            <Users className="w-4 h-4 mr-2" />
            Share with Team
          </Button>
        </CardContent>
      </Card>

      {/* Compliance & Security */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Lock className="w-5 h-5" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="encryption" className="text-sm font-medium">End-to-end Encryption</Label>
              <Switch id="encryption" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audit-log" className="text-sm font-medium">Audit Logging</Label>
              <Switch id="audit-log" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="gdpr" className="text-sm font-medium">GDPR Compliance</Label>
              <Switch id="gdpr" defaultChecked />
            </div>
          </div>
          
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <Shield className="w-4 h-4" />
              <span className="font-semibold">Enterprise Grade Security Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Notifications */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Bell className="w-5 h-5" />
            Smart Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Traffic Alerts</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Weather Updates</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Route Deviations</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Cost Overruns</Label>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {routeData ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Risk Level</span>
                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>• Weather conditions: Clear</div>
                <div>• Traffic density: Moderate</div>
                <div>• Road conditions: Good</div>
                <div>• Security rating: High</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Risk analysis available after route calculation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}