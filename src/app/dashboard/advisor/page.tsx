'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { BotMessageSquare, Send, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { handleAdvisorChat } from './actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      size="icon"
      className="absolute top-1/2 right-3 -translate-y-1/2"
      disabled={isPending}
    >
      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
    </Button>
  );
}


export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput || isPending) return;

    setError(undefined);
    setInput('');
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: currentInput },
    ];
    setMessages(newMessages);

    startTransition(async () => {
      try {
        const result = await handleAdvisorChat(newMessages);
        if (result.error) {
          setError(result.error);
        } else {
          setMessages(result.messages);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      }
    });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">AI Investment Advisor</h1>
        <p className="text-muted-foreground">
          Get personalized investment advice powered by AI. Ask me anything about your portfolio,
          market trends, or investment strategies.
        </p>
      </div>

      <div className="flex-1 flex flex-col bg-transparent rounded-lg overflow-hidden">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <BotMessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Ask me about your portfolio performance, risk analysis, diversification strategies,
                or any investment-related questions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex gap-3',
                    message.role === 'assistant' ? 'items-start' : 'items-start justify-end'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10">
                        <BotMessageSquare className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'rounded-lg px-4 py-3 max-w-[80%]',
                      message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:my-3">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border/50 p-4 bg-background/50 backdrop-blur-sm">
          {error && (
            <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your investments..."
              disabled={isPending}
              className="pr-12"
            />
            <SubmitButton isPending={isPending} />
          </form>
        </div>
      </div>
    </div>
  );
}
