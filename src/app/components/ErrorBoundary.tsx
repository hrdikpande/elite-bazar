import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
                    <div className="max-w-md w-full text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold">Something went wrong</h1>
                        <p className="text-muted-foreground">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <div className="p-4 bg-muted rounded-md text-left overflow-auto max-h-48 text-xs font-mono">
                                {this.state.error.message}
                            </div>
                        )}
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => window.location.reload()} variant="default">
                                Refresh Page
                            </Button>
                            <Button onClick={() => window.location.href = '/'} variant="outline">
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
