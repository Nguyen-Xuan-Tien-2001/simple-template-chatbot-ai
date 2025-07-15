'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { v4 as uuidv4 } from 'uuid';
import CustomLink from '@/lib/customlink';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Message, References } from '../../../../lib/getHistory';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from './chat-bubble';
import { ChatInput } from './chat-input';
import { ChatMessageList } from './chat-message-list';
import { useGetHistory } from './hooks/useGetHistory';
import { postQueryToChatBot } from './hooks/usePostQuery';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ReferenceIds: renders [1, 2] style references as hoverable links
const ReferenceIds: React.FC<{
	ids: string[];
	references: References[] | undefined;
}> = ({ ids, references }) => {
	if (!ids || ids.length === 0) return null;
	return (
		<span className="inline-flex gap-1">
			{ids.map((id, index) => {
				const idx = Number(id) - 1;
				const ref = references?.[idx];
				const fileName = ref?.metadata?.file_name;
				const fileUrl = ref?.metadata?.file_url || undefined;
				return (
					<HoverCard key={id}>
						<HoverCardTrigger className="text-blue-500 cursor-pointer font-semibold">
							[{id}]
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{ a: CustomLink }}
							>
								{fileUrl
									? `**Reference:**\n[${fileName?.replace(
											'.md',
											''
									  )}](${fileUrl})`
									: `**Reference:**\n*internal documents*`}
							</ReactMarkdown>
						</HoverCardContent>
					</HoverCard>
				);
			})}
		</span>
	);
};

export const UUID = '988b5c3b-4d21-4c0f-bddb-73957057b667';

export default function ChatSupport() {
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const router = useRouter();
	const conversation_id = searchParams?.get('conversation_id');

	const [conversationId, setConversationId] = useState<string>(
		conversation_id || uuidv4()
	);
	const [dataMessages, setDataMessages] = useState<Message[]>([]);
	const [query, setQuery] = useState('');
	const { data: messages, refetch } = useGetHistory({
		userId: UUID,
		conversation_id: conversationId,
	});

	useEffect(() => {
		if (conversation_id) setConversationId(conversation_id);
	}, [conversation_id]);

	useEffect(() => {
		if (messages) setDataMessages(messages);
	}, [messages]);

	useEffect(() => {
		const userId = localStorage.getItem('user_id');
		if (!userId) router.push('/login');
	}, [router]);

	const mutation = useMutation({
		mutationFn: postQueryToChatBot,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userConversations', UUID] });
			refetch();
		},
		onError: (error) => {
			console.error('Error posting query:', error);
			toast('Error posting query: ' + (error as Error).message);
		},
	});

	const handleSubmit = useCallback(() => {
		if (!query.trim() || mutation.isPending) return;
		setDataMessages((prev) => [
			...prev,
			{ role: 'user', content: query.trim() },
		]);
		setQuery('');
		mutation.mutate({
			query: query.trim(),
			user_id: UUID,
			conversation_id: conversationId,
		});
	}, [query, mutation, conversationId]);

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	};

	// Helper to render markdown with reference parsing
	const renderMarkdown = (content: string, references?: References[]) => {
		// Regex for [1, 2] style references
		const referenceRegex = /\[(\d+(?:,\s*\d+)*)\]/g;
		// Custom renderer for paragraphs and list items that preserves React elements
		type TagType = 'p' | 'li';
		const withReferenceParsing = (Tag: TagType) =>
			function Comp(props: any) {
				const { children, ...rest } = props;
				// Helper to recursively process children
				function process(child: any, keyPrefix = ''): React.ReactNode {
					if (typeof child === 'string') {
						// Parse references in string nodes
						const rendered: React.ReactNode[] = [];
						let lastIndex = 0;
						let match;
						while ((match = referenceRegex.exec(child)) !== null) {
							if (match.index > lastIndex) {
								rendered.push(child.substring(lastIndex, match.index));
							}
							const ids = match[1].split(',').map((id) => id.trim());
							rendered.push(
								<ReferenceIds
									key={keyPrefix + match.index}
									ids={ids}
									references={references}
								/>
							);
							lastIndex = match.index + match[0].length;
						}
						if (lastIndex < child.length) {
							rendered.push(child.substring(lastIndex));
						}
						return rendered.length > 0 ? rendered : child;
					} else if (Array.isArray(child)) {
						return child.map((c, i) => process(c, keyPrefix + i + '-'));
					} else if (React.isValidElement(child)) {
						// Recursively process children of React elements
						const el = child as React.ReactElement<any, any>;
						return React.cloneElement(
							el,
							el.props as any,
							process(el.props.children, keyPrefix)
						);
					}
					return child;
				}
				return React.createElement(Tag, rest, process(children));
			};
		return (
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					a: CustomLink,
					p: withReferenceParsing('p'),
					li: (props) => {
						const Comp = withReferenceParsing('li');
						return <Comp {...props} className="mb-1" />;
					},
					ul: ({ children, ...props }) => (
						<ul className="list-disc list-inside ml-6" {...props}>
							{children}
						</ul>
					),
					ol: ({ children, ...props }) => (
						<ol className="list-decimal list-inside ml-6" {...props}>
							{children}
						</ol>
					),
					h1: (props) => {
						const Comp = withReferenceParsing('h1' as any);
						return <Comp {...props} className="text-3xl font-bold mt-6 mb-2" />;
					},
					h2: (props) => {
						const Comp = withReferenceParsing('h2' as any);
						return <Comp {...props} className="text-2xl font-bold mt-5 mb-2" />;
					},
					h3: (props) => {
						const Comp = withReferenceParsing('h3' as any);
						return (
							<Comp {...props} className="text-xl font-semibold mt-4 mb-2" />
						);
					},
					h4: (props) => {
						const Comp = withReferenceParsing('h4' as any);
						return (
							<Comp {...props} className="text-lg font-semibold mt-3 mb-1" />
						);
					},
					h5: (props) => {
						const Comp = withReferenceParsing('h5' as any);
						return (
							<Comp {...props} className="text-base font-semibold mt-2 mb-1" />
						);
					},
					h6: (props) => {
						const Comp = withReferenceParsing('h6' as any);
						return (
							<Comp {...props} className="text-sm font-semibold mt-2 mb-1" />
						);
					},
				}}
			>
				{content}
			</ReactMarkdown>
		);
	};

	return (
		<div className="w-full h-full flex flex-col overflow-hidden relative pb-24 bg-background">
			<ScrollArea className="h-[68vh] px-2">
				<ChatMessageList>
					{!!dataMessages.length &&
						dataMessages.map((item, id) => (
							<ChatBubble
								key={id + item.content}
								variant={item.role === 'user' ? 'sent' : 'received'}
								className="mb-2"
							>
								<ChatBubbleAvatar
									fallback={item.role === 'user' ? 'U' : '✨'}
								/>
								<ChatBubbleMessage>
									{renderMarkdown(item.content || '', item.references)}
								</ChatBubbleMessage>
							</ChatBubble>
						))}

					{mutation.isPending && (
						<ChatBubble variant="received">
							<ChatBubbleAvatar fallback="AI" />
							<ChatBubbleMessage isLoading />
						</ChatBubble>
					)}
					{!dataMessages.length && (
						<p className="text-center text-4xl font-semibold custom-color m-auto mt-60">
							Xin chào Tien ♡
						</p>
					)}
				</ChatMessageList>
			</ScrollArea>
			<div className="flex items-center gap-2 absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
				<ChatInput
					placeholder="You can ask me any question about HSV or Yubikey..."
					disabled={mutation.isPending}
					value={query}
					onChange={(value) => setQuery(value.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button
					disabled={mutation.isPending}
					className="cursor-pointer"
					onClick={handleSubmit}
					type="submit"
					size="icon"
					aria-label="Send message"
				>
					<Send className="size-4 dark:text-secondary-foreground" />
				</Button>
			</div>
		</div>
	);
}
