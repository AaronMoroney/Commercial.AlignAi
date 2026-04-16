'use client';

import { useRef, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ModelSelector } from './model-selector';
import { ModelId } from '@/lib/types';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	selectedModels: ModelId[];
	onModelsChange: (models: ModelId[]) => void;
	disabled?: boolean;
}

export function ChatInput({
	value,
	onChange,
	onSend,
	selectedModels,
	onModelsChange,
	disabled,
}: ChatInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (value.trim()) onSend();
		}
	}

	return (
		<>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background from-10% via-background/20 to-transparent" />
			<div className='p-4 z-10 absolute bottom-0 w-full backdrop-blur-xs'>
				<div className='mx-auto max-w-3xl space-y-3 '>
					{/* Model selector */}
					<div className='flex items-center justify-center gap-2'>
						<ModelSelector
							selected={selectedModels}
							onChange={onModelsChange}
						/>
					</div>

					{/* Input row */}
					<div className='flex gap-2 items-end bg-card border-border border-2 p-1 rounded-2xl'>
						<Textarea
							ref={textareaRef}
							value={value}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder='Message AlignAI'
							className='min-h-40 max-h-40 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none'
							disabled={disabled}
							rows={1}
						/>
						<Button
							onClick={onSend}
							disabled={disabled || !value.trim()}
							size='icon'
							className='shrink-0 bg-primary'
						>
							<SendHorizonal className='size-4' />
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
