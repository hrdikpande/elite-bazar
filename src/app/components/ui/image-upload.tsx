import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

function UrlInput({ onSubmit }: { onSubmit: (val: string) => void }) {
    const [url, setUrl] = useState('');
    return (
        <div className="flex-1 flex gap-2">
            <Input
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (url) onSubmit(url);
                    }
                }}
            />
            <Button type="button" onClick={() => { if (url) onSubmit(url); }}>Add</Button>
        </div>
    );
}

export function ImageUpload({ value, onChange, className = "", placeholder = "Drag & drop image here, or click to select" }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [inputType, setInputType] = useState<'file' | 'url'>('file');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Check if image
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                onChange(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleClear = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {value ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted group">
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={handleClear} type="button">
                            <X className="h-4 w-4 mr-2" />
                            Remove Image
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Tabs for Input Type */}
                    <div className="flex bg-muted rounded-md p-1 w-fit">
                        <button
                            type="button"
                            onClick={() => setInputType('file')}
                            className={`px-3 py-1 text-sm rounded-sm transition-colors ${inputType === 'file' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setInputType('url')}
                            className={`px-3 py-1 text-sm rounded-sm transition-colors ${inputType === 'url' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Image URL
                        </button>
                    </div>

                    {inputType === 'file' ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
              `}
                        >
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Upload className="h-8 w-8 mb-2" />
                                <p className="text-sm font-medium text-foreground">{placeholder}</p>
                                <p className="text-xs">Supports JPG, PNG, WEBP</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <UrlInput onSubmit={onChange} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
