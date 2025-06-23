"use client";

import { useState, useRef } from "react";
import { countBaskets, type CountBasketsOutput } from "@/ai/flows/count-baskets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Clapperboard, Medal, BrainCircuit, PlayCircle, Loader2, Mic, ThumbsUp, ThumbsDown } from "lucide-react";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CountBasketsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        if (file.size > 50 * 1024 * 1024) { 
          toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload a video smaller than 50MB.",
          });
          return;
        }
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoPreviewUrl(url);
        setAnalysis(null);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a valid video file.",
        });
      }
    }
  };

  const toDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleAnalyze = async () => {
    if (!videoFile) return;

    setIsLoading(true);
    setAnalysis(null);

    try {
      const videoDataUri = await toDataURL(videoFile);
      const result = await countBaskets({ videoDataUri });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Something went wrong. Please try another video or a shorter one.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary tracking-tight">Hoops Insights</h1>
          <p className="mt-2 text-lg text-muted-foreground">Upload your game footage and let AI analyze your performance.</p>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><UploadCloud className="w-6 h-6 text-primary"/>Upload Your Game</CardTitle>
                <CardDescription>Select a video file from your device to begin.</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden"
                    accept="video/*"
                  />
                  {!videoPreviewUrl ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <UploadCloud className="w-12 h-12" />
                      <p>Click or drag to upload video</p>
                      <p className="text-xs">(Max 50MB)</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Clapperboard className="w-12 h-12 text-primary" />
                      <p className="font-semibold text-foreground">{videoFile?.name}</p>
                      <video src={videoPreviewUrl} controls className="w-full rounded-lg max-h-64 aspect-video object-cover" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!videoFile || isLoading}
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Analyze Gameplay
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-8">
              {isLoading && (
                <>
                  <Card className="shadow-lg animate-pulse">
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-12">
                      <Skeleton className="h-24 w-24 rounded-full" />
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg animate-pulse">
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg animate-pulse">
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                  </Card>
                </>
              )}

              {analysis && (
                <>
                  <Card className="shadow-lg bg-card border-accent/50">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl flex items-center gap-2"><Medal className="w-6 h-6 text-accent"/>Score Summary</CardTitle>
                      <CardDescription>Total baskets scored in the video.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-8xl font-bold text-accent font-headline">{analysis.numberOfBaskets}</p>
                      <p className="text-2xl text-muted-foreground mt-2">Baskets</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-primary"/>AI Game Analysis</CardTitle>
                      <CardDescription>Strengths and weaknesses from your game.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <ThumbsUp className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Strengths</h3>
                                <p className="text-base leading-relaxed text-muted-foreground">{analysis.analysis.strengths}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <ThumbsDown className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Weaknesses</h3>
                                <p className="text-base leading-relaxed text-muted-foreground">{analysis.analysis.weaknesses}</p>
                            </div>
                        </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl flex items-center gap-2"><Mic className="w-6 h-6 text-primary"/>Live Commentary</CardTitle>
                      <CardDescription>A play-by-play of the action.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed">{analysis.commentary}</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
        <p>Powered by Firebase and Google AI</p>
      </footer>
    </div>
  );
}
