'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { Message, MODELS, ModelId } from '@/lib/types';
import { ModelBadge } from './model-badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessageProps {
	message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.role === 'user';
	const availableModels = message.responses
		? MODELS.filter((m) => message.responses![m.id] !== undefined)
		: [];
	const [activeModel, setActiveModel] = useState<ModelId | null>(
		availableModels[0]?.id ?? null,
	);

	const displayContent =
		!isUser && activeModel && message.responses
			? message.responses[activeModel]
			: message.content;

	return (
		<div className={cn('flex gap-3 py-4', isUser && 'flex-row-reverse')}>
			{!isUser && (
				<Avatar className='size-8 shrink-0 mt-0.5'>
					<AvatarFallback className='text-xs font-semibold bg-muted text-muted-foreground'>
						AI
					</AvatarFallback>
				</Avatar>
			)}

			{/*  make chat full width if assistant, when branching, we will make them small so can view branch */}
			<div
				className={cn(
					'flex flex-col gap-2 max-w-[95%]',
					isUser && 'items-end max-w-[80%]',
				)}
			>
				{/* Model chips — only on assistant messages with multiple responses */}
				{!isUser && availableModels.length > 1 && (
					<div className='flex flex-wrap gap-1.5'>
						{availableModels.map((model) => (
							<ModelBadge
								key={model.id}
								model={model}
								active={activeModel === model.id}
								onClick={() => setActiveModel(model.id)}
							/>
						))}
					</div>
				)}

				{/* Single chip label when only one model responded */}
				{!isUser && availableModels.length === 1 && (
					<div className='flex gap-1.5'>
						<ModelBadge model={availableModels[0]} active />
					</div>
				)}

				<div
					className={cn(
						'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
						isUser
							? 'bg-primary text-primary-foreground rounded-tr-sm'
							: 'bg-card text-card-foreground border border-border rounded-tl-sm',
					)}
				>
					{/* theres a bug here */}
					{displayContent ? (
						<div>
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								rehypePlugins={[rehypeHighlight]}
							>
								{displayContent}
							</ReactMarkdown>
						</div>
					) : (
						<span className='text-muted-foreground italic'>
							Awaiting response…
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
