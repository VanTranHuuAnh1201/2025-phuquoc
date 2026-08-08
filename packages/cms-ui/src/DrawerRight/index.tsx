// @ts-nocheck
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import { Button } from '../Button';
import useDrawerRight from './use-drawer';
import { useGlobal } from '@/stores/global';

const Drawer = () => {
	const { allDrawers, hide, hideAll } = useDrawerRight();
	const { openLoading } = useGlobal();

	// Filter open drawers only
	const openDrawers = allDrawers.filter((drawer) => drawer.open);

	// No drawers to show
	if (openDrawers.length === 0) {
		return null;
	}

	return (
		<Fragment>
			{openDrawers.map((drawerState) => {
				const onOpenChange = (open: boolean) => {
					if (!open) {
						// drawerState?.setOpen?.(undefined);
						// hide(drawerState.id);
					}
				};

				const clickOutside = (e: any) => {
					// Check if the click is on another drawer
					const target = e.target as HTMLElement;
					const isClickOnAnotherDrawer = openDrawers.some((drawer) => {
						// Skip the current drawer
						if (drawer.id === drawerState.id) return false;

						// Check if the click target is within another drawer
						const otherDrawerElement = document.getElementById(drawer.id);
						return (
							otherDrawerElement &&
							(otherDrawerElement === target ||
								otherDrawerElement.contains(target))
						);
					});

					// Only hide if not clicking on another drawer
					if (!isClickOnAnotherDrawer) {
						// hide(drawerState.id);
						hideAll();
					}
				};

				return (
					<>
						<Sheet
							key={drawerState.id}
							{...drawerState}
							onOpenChange={onOpenChange}
						>
							{drawerState.open && (
								<div className='fixed inset-0 backdrop-blur-[2px] z-40' />
							)}
							<SheetContent
								id={drawerState?.id}
								className={cn(
									drawerState?.contentClassname,
									'p-0 max-w-screen sm:min-w-[522px] box-border h-full'
									// 'bg-[url(./assets/images/background-drawer.png)] bg-fixed bg-no-repeat bg-cover'
								)}
								onInteractOutside={clickOutside}
								isHeader={drawerState?.isHeader}
								isBack={drawerState?.isBack}
							>
								<div className='flex flex-col h-full max-h-screen'>
									{drawerState?.isHeader && (
										<SheetHeader className='flex-shrink-0 text-center bg-white border-b border-neutral-light-400'>
											{drawerState?.title && (
												<SheetTitle className='text-[18px] font-medium'>
													{drawerState?.title}
												</SheetTitle>
											)}
										</SheetHeader>
									)}

									<div className='h-fit overflow-y-auto overflow-x-hidden'>
										{drawerState?.children}
									</div>

									{drawerState?.isFooter && (
										<div className='flex-shrink-0 px-6 py-0'>
											<div className='flex flex-col-reverse sm:flex-row sm:justify-end w-full items-center gap-2'>
												{drawerState?.cancelMess && (
													<Button
														onClick={() => hide(drawerState.id)}
														loading={drawerState?.loadingCancel}
														className='w-full rounded-[4px]'
														size={'md'}
														variant='outline-primary'
													>
														{drawerState?.cancelMess}
													</Button>
												)}
												<Button
													onClick={drawerState?.onOk}
													loading={drawerState?.loadingOk || openLoading}
													variant={'active'}
													className='w-full rounded-[4px]'
													type='button'
													{...(drawerState?.idForm && {
														form: drawerState?.idForm,
														type: 'submit',
													})}
													size={'sm'}
												>
													{drawerState?.okMess}
												</Button>
											</div>
										</div>
									)}
								</div>
							</SheetContent>
						</Sheet>
					</>
				);
			})}
		</Fragment>
	);
};

export default Drawer;
