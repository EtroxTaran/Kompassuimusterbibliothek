/**
 * FIGMA IMPORT TEMPLATE
 * 
 * This template demonstrates how to properly structure and style components
 * when importing designs from Figma MCP, ensuring they use the KOMPASS design system.
 * 
 * KEY PRINCIPLES:
 * 1. Use design system color classes (bg-primary, text-foreground, etc.)
 * 2. Use existing shadcn/ui components when possible
 * 3. Avoid hardcoded colors, sizes, and arbitrary values
 * 4. Let HTML elements use default typography (h1, h2, p, etc.)
 * 5. Ensure theme switching works (light/dark mode)
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  Building2, 
  Calendar, 
  Euro, 
  TrendingUp, 
  Users,
  Plus,
  Search,
  Filter
} from 'lucide-react';

/**
 * ✅ CORRECT: Using Design System Components
 * 
 * This example shows the proper way to build a page after importing from Figma.
 * All colors, spacing, and typography use design system tokens.
 */
export function FigmaImportTemplateCorrect() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6">
      {/* Page Header - Standard KOMPASS Pattern */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Project Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all active projects and their status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards - Using design system colors */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h2 className="text-primary">42</h2>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h2 className="text-primary">€ 1.2M</h2>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h2 className="text-primary">28</h2>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h2 className="text-primary">+15.3%</h2>
            <p className="text-xs text-muted-foreground">
              Year over year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar - Using design system inputs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project List - Using design system components */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>
            Your most recent projects and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Project Item 1 */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">RE</AvatarFallback>
                </Avatar>
                <div>
                  <h4>REWE München Süd</h4>
                  <p className="text-sm text-muted-foreground">Store renovation project</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium text-primary">€ 125,000</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: Feb 15, 2025
                  </div>
                </div>
                <Badge className="bg-accent text-accent-foreground">In Progress</Badge>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>

            <Separator />

            {/* Project Item 2 */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">ED</AvatarFallback>
                </Avatar>
                <div>
                  <h4>Edeka Hamburg</h4>
                  <p className="text-sm text-muted-foreground">Refrigeration system upgrade</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium text-primary">€ 85,000</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: Mar 01, 2025
                  </div>
                </div>
                <Badge variant="secondary">Planning</Badge>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>

            <Separator />

            {/* Project Item 3 */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">BM</AvatarFallback>
                </Avatar>
                <div>
                  <h4>Biomarkt Heidelberg</h4>
                  <p className="text-sm text-muted-foreground">Complete organic section</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium text-primary">€ 95,000</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: Jan 20, 2025
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">Completed</Badge>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * ❌ INCORRECT: What to Avoid After Figma Import
 * 
 * This shows common mistakes when importing from Figma.
 * DO NOT follow these patterns!
 */
export function FigmaImportTemplateIncorrect() {
  return (
    <div className="p-[24px]">
      {/* ❌ WRONG: Hardcoded colors and arbitrary values */}
      <div className="bg-[#FFFFFF] rounded-[12px] p-[32px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        {/* ❌ WRONG: Hardcoded font sizes and colors */}
        <h2 className="text-[#333333] text-[24px] font-[700] mb-[20px]">
          Project Dashboard
        </h2>
        
        {/* ❌ WRONG: Using arbitrary color values instead of design tokens */}
        <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
          <div className="bg-[#F9FAFB] p-[20px] rounded-[8px] border border-[#E5E7EB]">
            {/* ❌ WRONG: Hardcoded blue color instead of primary */}
            <div className="text-[#0066CC] text-[32px] font-[800]">42</div>
            <div className="text-[#6B7280] text-[14px]">Total Projects</div>
          </div>
        </div>

        {/* ❌ WRONG: Creating custom components instead of using shadcn */}
        <div className="flex items-center gap-[12px] mb-[16px]">
          <input 
            type="text" 
            placeholder="Search..."
            className="flex-1 px-[16px] py-[10px] border border-[#D1D5DB] rounded-[6px]"
            style={{ fontSize: '14px' }}
          />
          {/* ❌ WRONG: Custom button with hardcoded styles */}
          <button 
            className="px-[20px] py-[10px] bg-[#0066CC] text-[#FFFFFF] rounded-[6px]"
            style={{ fontWeight: 600 }}
          >
            Search
          </button>
        </div>

        {/* ❌ WRONG: Inline styles and absolute positioning */}
        <div style={{ 
          backgroundColor: '#F3F4F6', 
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            color: '#111827',
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            Recent Activity
          </div>
        </div>

        {/* ❌ WRONG: Using fixed widths instead of responsive classes */}
        <div className="w-[800px] h-[400px] bg-[#FFFFFF]">
          {/* Content */}
        </div>
      </div>
    </div>
  );
}

/**
 * 🔄 CONVERSION EXAMPLE
 * 
 * Before: Figma-generated code with hardcoded values
 * After: Properly refactored to use KOMPASS design system
 */

// ❌ BEFORE (from Figma)
export function BeforeFigmaRefactor() {
  return (
    <div className="bg-[#FFFFFF] rounded-[12px] p-[24px] border border-[#E5E7EB]">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-[#111827] text-[18px] font-[600]">Customer Info</h3>
        <div className="px-[12px] py-[4px] bg-[#3B82F6] text-[#FFFFFF] rounded-[4px] text-[12px]">
          Active
        </div>
      </div>
      <div className="text-[#6B7280] text-[14px]">
        REWE München
      </div>
    </div>
  );
}

// ✅ AFTER (properly refactored)
export function AfterFigmaRefactor() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Customer Info</CardTitle>
          <Badge className="bg-primary text-primary-foreground">Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          REWE München
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * 📋 QUICK REFERENCE: Common Conversions
 */

// Hardcoded → Design System
const conversionGuide = {
  // Colors
  'bg-[#FFFFFF]': 'bg-card',
  'bg-[#F9FAFB]': 'bg-background',
  'bg-[#0066CC]': 'bg-primary',
  'text-[#111827]': 'text-foreground',
  'text-[#6B7280]': 'text-muted-foreground',
  'border-[#E5E7EB]': 'border-border',
  
  // Spacing
  'p-[24px]': 'p-6',
  'gap-[16px]': 'gap-4',
  'mb-[20px]': 'mb-5',
  'rounded-[12px]': 'rounded-lg',
  
  // Typography - Let HTML elements handle it!
  'text-[18px] font-[600]': '<h4> (no classes needed)',
  'text-[14px]': 'text-sm (only if needed)',
  
  // Components
  '<input>': '<Input /> from shadcn',
  '<button>': '<Button /> from shadcn',
  '<select>': '<Select /> from shadcn',
};

// Demo wrapper
export function FigmaImportTemplateDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>✅ Correct: Using Design System</CardTitle>
          <CardDescription>
            This example properly uses KOMPASS design system components and tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FigmaImportTemplateCorrect />
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">❌ Incorrect: Hardcoded Values</CardTitle>
          <CardDescription>
            This shows what NOT to do - avoid hardcoded colors, arbitrary values, and inline styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="opacity-50">
            <FigmaImportTemplateIncorrect />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>❌ Before Refactoring</CardTitle>
            <CardDescription>Figma-generated code</CardDescription>
          </CardHeader>
          <CardContent>
            <BeforeFigmaRefactor />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ After Refactoring</CardTitle>
            <CardDescription>Using design system</CardDescription>
          </CardHeader>
          <CardContent>
            <AfterFigmaRefactor />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Reference: Common Conversions</CardTitle>
          <CardDescription>
            Use this guide when converting Figma imports to design system classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <h4 className="mb-2">Hardcoded Value</h4>
              <div className="space-y-1 font-mono text-sm text-destructive">
                {Object.keys(conversionGuide).map((key) => (
                  <div key={key} className="p-2 bg-destructive/10 rounded">
                    {key}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2">Design System Class</h4>
              <div className="space-y-1 font-mono text-sm text-primary">
                {Object.values(conversionGuide).map((value, idx) => (
                  <div key={idx} className="p-2 bg-primary/10 rounded">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
