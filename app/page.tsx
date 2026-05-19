'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExamLibrary, LibraryPaper } from '@/types/library';
import { getExamLibrary, flattenLibrary } from '@/lib/exam-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Clock, 
  GraduationCap, 
  ChevronRight, 
  Loader2, 
  FileText,
  Search,
  Plus,
  FolderOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const router = useRouter();
  const [library, setLibrary] = useState<ExamLibrary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<LibraryPaper | null>(null);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    async function loadLibrary() {
      const data = await getExamLibrary();
      setLibrary(data);
      setLoading(false);
    }
    loadLibrary();
  }, []);

  const allPapers = useMemo(() => {
    if (!library) return [];
    return flattenLibrary(library);
  }, [library]);

  const filteredPapers = useMemo(() => {
    return allPapers.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.path.some(folder => folder.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allPapers, searchQuery]);

  // Group papers by their top-level category for the sectioned view
  const groupedCategories = useMemo(() => {
    const groups: Record<string, LibraryPaper[]> = {};
    filteredPapers.forEach(paper => {
      const rootCat = paper.path[0] || '未分类';
      if (!groups[rootCat]) groups[rootCat] = [];
      groups[rootCat].push(paper);
    });
    return Object.entries(groups).map(([name, papers]) => ({ name, papers }));
  }, [filteredPapers]);

  const handleCustomUrlStart = () => {
    if (!customUrl.trim()) return;
    router.push(`/exam?url=${encodeURIComponent(customUrl.trim())}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">正在获取题库清单...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg">
              <GraduationCap className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            模拟考试系统
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            从云端加载海量题库，开启你的深度测评之旅。
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索试卷名称、分类或关键字..." 
                className="pl-10 h-12 bg-white/50 backdrop-blur shadow-sm rounded-xl border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {groupedCategories.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <FolderOpen className="w-4 h-4 text-primary/60" />
                      <h2 className="text-lg font-bold">{category.name}</h2>
                      <Badge variant="outline" className="ml-auto font-mono text-[10px]">
                        {category.papers.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {category.papers.map((paper) => (
                        <button
                          key={paper.id}
                          onClick={() => setSelectedPaper(paper)}
                          className={`group text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                            selectedPaper?.id === paper.id
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border bg-white hover:border-primary/30 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          <div className={`p-3 rounded-lg shrink-0 transition-colors ${
                            selectedPaper?.id === paper.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate">{paper.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              {paper.path.slice(1).map((segment, idx) => (
                                <React.Fragment key={idx}>
                                  <span className="text-[10px] text-muted-foreground/40">/</span>
                                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{segment}</span>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                          {selectedPaper?.id === paper.id && (
                            <ChevronRight className="w-5 h-5 text-primary animate-in slide-in-from-left-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {groupedCategories.length === 0 && (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    <p>未找到匹配的试卷</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-xl">开始考试</CardTitle>
                <CardDescription>选中左侧试卷后即可点击开始</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {selectedPaper ? (
                  <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border space-y-3 animate-in fade-in zoom-in duration-300">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">当前选中</p>
                    <p className="font-bold text-sm leading-tight">{selectedPaper.name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedPaper.path.map((segment, idx) => (
                        <Badge key={idx} variant={idx === 0 ? "default" : "secondary"} className={`text-[10px] px-1.5 py-0 h-5 font-bold ${idx === 0 ? "" : "bg-primary/5 text-primary border-none"}`}>
                          {segment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl text-muted-foreground text-sm gap-2">
                    <BookOpen className="w-6 h-6 opacity-20" />
                    <span>请选择试卷</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {selectedPaper ? (
                  <Button asChild size="lg" className="w-full h-12 text-lg font-bold shadow-lg transition-all scale-100 hover:scale-[1.02]">
                    <Link href={`/exam?url=${encodeURIComponent(selectedPaper.url)}`}>
                      进入考试 <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled size="lg" className="w-full h-12 text-lg font-bold opacity-50">
                    开始考试
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none shadow-lg font-bold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Plus className="w-5 h-5" /> 自定义导入
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 opacity-90 text-sm text-primary-foreground">
                <p>支持从任意 GitHub Repo 加载符合格式的 JSON 试卷。</p>
                <div className="space-y-2">
                  <Input 
                    placeholder="输入试卷 JSON 的 URL..." 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30 h-10 rounded-lg"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold border-none"
                    disabled={!customUrl.trim()}
                    onClick={handleCustomUrlStart}
                  >
                    立刻加载并考试
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="px-4 py-3 bg-muted/50 rounded-xl border border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-[10px]">v0.3.0</Badge>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Recursive Library</span>
              </div>
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
