'use client';

import Image from 'next/image';
import { MODELS, ModelId } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
	selected: ModelId[];
	onChange: (selected: ModelId[]) => void;
}

export function ModelSelector({ selected, onChange }: ModelSelectorProps) {
	function toggle(id: ModelId) {
		if (selected.includes(id)) {
			if (selected.length === 1) return; // keep at least one
			onChange(selected.filter((m) => m !== id));
		} else {
			onChange([...selected, id]);
		}
	}

	return (
		<div className='flex gap-1.5'>
			{MODELS.map((model) => {
				const active = selected.includes(model.id);
				return (
					<button
						key={model.id}
						onClick={() => toggle(model.id)}
						className={cn(
							'inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-xs font-medium transition-all',
							'border',
							active
								? 'border-primary bg-primary/10 text-primary'
								: 'border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-accent',
						)}
					>
						<span className='flex'>
							<div className='p-1 rounded-full bg-white mr-2'>
								<Image
									src={model.icon}
									alt={`${model.model} icon`}
									width={15}
								/>
							</div>
							<p className="flex items-center pr-2 font-mono">{model.model}</p>
						</span>
					</button>
				);
			})}
		</div>
	);
}
