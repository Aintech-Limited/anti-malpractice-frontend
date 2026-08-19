'use client';
import Link from 'next/link';
import { useAuth } from '@/src/providers/auth/AuthContext';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
	Menu,
	X,
	Globe,
	ChevronDown,
	LogOut,
	User,
	Box,
	BookOpen,
	Layout,
	HelpCircle,
	Shield,
	ChevronUp,
} from 'lucide-react';
import Image from 'next/image';
import { aintechLogo } from '@/public/assetLinks';
import MobileSubItem from './MobileSubItem/MobileSubItem';
import DropdownItem from './DropdownItem/DropdownItem';
import { usePathname, useRouter } from 'next/navigation';
import { signOut as GoogleSinOut } from 'next-auth/react';
import {
	ProtectedRouteEnum,
	ProtectedRouteEnumValue,
	UnProtectedRouteEnum,
} from '@/src/lib/enums';
import {
	clearFaceAuthState,
	setFaceAuthState,
} from '@/src/redux/features/faceAuth/faceAuthSlice';
import { useAppDispatch, useAppSelector } from '@/src/redux/reduxStore';
import {
	clearSelfieImageId,
	clearVerification,
} from '@/src/redux/features/lecturerVerificationImages/lecturerVerificationImages';
import FaceIDSetupModal from '../Dashboard/FaceIDSetupModal/FaceIDSetupModal';
import { APP_NAME } from '@/src/lib/data';

const Header = () => {
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const { SkipFaceAuth } = useAppSelector((state) => state.afaceAuth);

	const { user, loading, signOut, signIn } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	const [showFaceId, setShowFaceId] = useState<boolean>(false);

	// Mobile accordion states
	const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
	const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

	const [windowWidth, setWindowWidth] = useState<number | null>(null);

	const MOBILE_BREAKPOINT = 900;

	useEffect(() => {
		if (
			!Object.values(ProtectedRouteEnum).includes(
				pathname as ProtectedRouteEnumValue,
			)
		) {
			if (
				[UnProtectedRouteEnum.SIGNUP, UnProtectedRouteEnum.SIGNIN].includes(
					pathname as any,
				)
			) {
				signOut();
			}
			return;
		}

		const timer = setTimeout(() => {
			if (!user || user === undefined) {
				const getUserData = async () => {
					try {
						const res = await fetch('/api/v1/users', {
							method: 'GET',
							credentials: 'include',
						});

						if (res.ok) {
							const data = await res.json();
							signIn(data.data);
						}
					} catch (error) {
						console.error((error as Error).message);
					}
				};

				getUserData();
			}
		}, 3_000);

		return () => clearTimeout(timer);
	}, [pathname, signIn, signOut, user]);

	useEffect(() => {
		if (
			!Object.values(ProtectedRouteEnum).includes(
				pathname as ProtectedRouteEnumValue,
			)
		)
			return;
		if (user?.profileType === 'LECTURER' && user?.idRecorded === false) {
			router.push('/dashboard/verify');
			return;
		}
		if (
			!user?.faceAuthEnabled &&
			user?.profileType === 'STUDENT' &&
			!SkipFaceAuth
		) {
			const enableFaceAuth = () => {
				setShowFaceId(true);
			};
			enableFaceAuth();
			return;
		}
	}, [
		SkipFaceAuth,
		pathname,
		router,
		user?.faceAuthEnabled,
		user?.idRecorded,
		user?.profileType,
	]);

	useEffect(() => {
		const handleClickOutside = () => setActiveDropdown(null);
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	}, []);

	useLayoutEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		handleResize(); // initial
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const toggleDropdown = (e: React.MouseEvent, name: string) => {
		e.stopPropagation();
		setActiveDropdown(activeDropdown === name ? null : name);
	};

	const handleLogout = async () => {
		try {
			const res = await fetch('/api/v1/auth/signout', {
				method: 'DELETE',
				credentials: 'include',
			});
			if (res.status < 400 || res.status === 401) {
				const data = await res.json();
				console.log(data.message);

				signOut();
				dispatch(clearFaceAuthState());
				dispatch(clearVerification());
				dispatch(clearSelfieImageId());
				setActiveDropdown(null);
				setIsMenuOpen(false);
				GoogleSinOut({
					redirect: true,
					callbackUrl: UnProtectedRouteEnum.SIGNIN,
				});

				console.log('User logged out');
				router.push(UnProtectedRouteEnum.SIGNIN);
				return;
			} else {
				console.log(await res.json());
			}
		} catch (error) {
			console.warn('signout error: ', error);
		}
	};

	const handleCloseFaceId = () => {
		setShowFaceId(false);
		dispatch(setFaceAuthState({ SkipFaceAuth: true }));
		return;
	};

	return (
		<header className=" sticky relative w-full border-b border-gray-100 bg-white top-0 z-50">
			<FaceIDSetupModal
				isOpen={showFaceId}
				onClose={() => handleCloseFaceId()}
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 flex items-center justify-between h-20">
				{/* Logo */}
				<Link href="/">
					<div className="flex items-center gap-2">
						<Image
							src={aintechLogo}
							alt="AINTECH LOGO"
							width={60}
							height={40}
						/>
						<span className="font-bold text-slate-900 tracking-tight text-l">
							{APP_NAME}
						</span>
					</div>
				</Link>

				{/* Desktop Navigation */}
				{windowWidth && windowWidth > 700 && (
					<nav className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-600">
						<Link href="/" className="hover:text-blue-600 transition-colors">
							Home
						</Link>

						{/* <div className="relative">
              <button
                onClick={(e) => toggleDropdown(e, "products")}
                className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                  activeDropdown === "products" ? "text-blue-600" : ""
                }`}
              >
                Products{" "}
                <ChevronDown
                  size={14}
                  className={
                    activeDropdown === "products"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>
              {activeDropdown === "products" && (
                <div className="absolute top-10 left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-2 animate-in fade-in zoom-in duration-150">
                  <DropdownItem
                    icon={<Box size={16} />}
                    label="AI Models"
                    desc="LLM Infrastructure"
                    href="/products/ai"
                  />
                  <DropdownItem
                    icon={<Layout size={16} />}
                    label="Dashboard"
                    desc="Analytics Tools"
                    href="/products/dashboard"
                  />
                </div>
              )}
            </div> */}

						<div className="relative">
							<button
								onClick={(e) => toggleDropdown(e, 'resources')}
								className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
									activeDropdown === 'resources' ? 'text-blue-600' : ''
								}`}
							>
								Resources{' '}
								<ChevronDown
									size={14}
									className={
										activeDropdown === 'resources'
											? 'rotate-180 transition-transform'
											: 'transition-transform'
									}
								/>
							</button>
							{activeDropdown === 'resources' && (
								<div className="absolute top-10 left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-2 animate-in fade-in zoom-in duration-150">
									{/* <DropdownItem
										icon={<BookOpen size={16} />}
										label="Documentation"
										href="/docs"
									/>
									<DropdownItem
										icon={<HelpCircle size={16} />}
										label="Help Center"
										href="/support"
									/> */}
									<DropdownItem
										icon={<Shield size={16} />}
										label="Privacy"
										href="/privacy"
									/>
									<DropdownItem
										icon={<Shield size={16} />}
										label="Terms"
										href="/terms"
									/>
								</div>
							)}
						</div>

						{/* <Link
							href="/pricing"
							className="hover:text-blue-600 transition-colors"
						>
							Pricing
						</Link> */}
					</nav>
				)}

				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center gap-6">
						<div className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
							<Globe size={18} />
							<span className="font-semibold text-sm text-slate-900">EN</span>
						</div>

						<div className="relative">
							{loading ? (
								<div className="h-8 w-8 bg-gray-100 animate-pulse rounded-full"></div>
							) : user ? (
								<button
									onClick={(e) => toggleDropdown(e, 'profile')}
									className="flex items-center gap-2 group p-1 pr-3 rounded-full hover:bg-gray-50 transition-colors"
								>
									<div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold text-xs">
										{user?.email[0]?.toUpperCase()}
									</div>
									<span className="text-sm font-semibold text-slate-900">
										{user?.email}
									</span>
								</button>
							) : pathname === UnProtectedRouteEnum.SIGNIN ? null : (
								<Link
									href={UnProtectedRouteEnum.SIGNIN}
									className="font-bold text-sm text-slate-900 hover:text-blue-600"
								>
									Log in
								</Link>
							)}

							{activeDropdown === 'profile' && user && (
								<div className="absolute top-12 right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
									<button
										onClick={() => console.log('Profile view')}
										className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
									>
										<User size={16} /> View Profile
									</button>
									<div className="h-px bg-gray-100 my-1" />
									<button
										onClick={handleLogout}
										className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									>
										<LogOut size={16} /> Logout
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Mobile Hamburger Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 text-slate-600"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* MOBILE SIDE MENU */}
			{isMenuOpen &&
				windowWidth !== null &&
				windowWidth <= MOBILE_BREAKPOINT && (
					<>
						<div
							className="fixed inset-0 bg-black/20 z-30 md:hidden"
							onClick={() => setIsMenuOpen(false)}
						/>

						{/* Side Menu */}
						<div className="fixed top-0 left-0 h-full w-64 max-w-full bg-white z-40 shadow-lg overflow-y-auto animate-in slide-in-from-left duration-300 md:hidden">
							<div className="flex flex-col p-4 gap-2 h-full">
								{/* User Section */}
								<div className="mb-4 pb-4 border-b border-gray-100">
									{user ? (
										<div className="flex flex-col gap-3">
											<div className="flex items-center gap-2">
												<div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
													{user.email[0].toUpperCase()}
												</div>
												<div className="flex flex-col min-w-0">
													<span className="font-bold text-slate-900 text-sm truncate break-all">
														{user.email}
													</span>
													<button
														onClick={() => console.log('Profile')}
														className="text-xs text-blue-600 text-left"
													>
														View Profile
													</button>
												</div>
											</div>
											<button
												onClick={handleLogout}
												className="flex items-center gap-2 text-red-600 text-xs font-semibold cursor-pointer"
											>
												<LogOut size={16} /> Logout
											</button>
										</div>
									) : (
										<Link
											href="/login"
											className="text-xl font-bold text-slate-900"
											onClick={() => setIsMenuOpen(false)}
										>
											Log in
										</Link>
									)}
								</div>

								{/* Nav Links */}
								<nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
									<Link
										href="/"
										className="py-2 text-base font-semibold text-slate-900 border-b border-gray-50"
										onClick={() => setIsMenuOpen(false)}
									>
										Home
									</Link>

									{/* <div className="flex flex-col border-b border-gray-50">
										<button
											onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
											className="flex items-center justify-between py-2 text-base font-semibold text-slate-900"
										>
											Products{' '}
											{mobileProductsOpen ? (
												<ChevronUp size={18} />
											) : (
												<ChevronDown size={18} />
											)}
										</button>
										{mobileProductsOpen && (
											<div className="pl-3 pb-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
												<MobileSubItem
													icon={<Box size={16} />}
													label="AI Models"
													href="/products/ai"
												/>
												<MobileSubItem
													icon={<Layout size={16} />}
													label="Dashboard"
													href="/products/dashboard"
												/>
											</div>
										)}
									</div> */}

									<div className="flex flex-col border-b border-gray-50">
										<button
											onClick={() =>
												setMobileResourcesOpen(!mobileResourcesOpen)
											}
											className="flex items-center justify-between py-2 text-base font-semibold text-slate-900"
										>
											Resources{' '}
											{mobileResourcesOpen ? (
												<ChevronUp size={18} />
											) : (
												<ChevronDown size={18} />
											)}
										</button>
										{mobileResourcesOpen && (
											<div className="pl-3 pb-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
												{/* <MobileSubItem
													icon={<BookOpen size={16} />}
													label="Documentation"
													href="/docs"
												/>
												<MobileSubItem
													icon={<HelpCircle size={16} />}
													label="Help Center"
													href="/support"
												/> */}
												<MobileSubItem
													icon={<Shield size={16} />}
													label="Privacy"
													href="/privacy"
												/>
												<MobileSubItem
													icon={<Shield size={16} />}
													label="Terms"
													href="/terms"
												/>
											</div>
										)}
									</div>

									{/* <Link
										href="/pricing"
										className="py-2 text-base font-semibold text-slate-900"
										onClick={() => setIsMenuOpen(false)}
									>
										Pricing
									</Link> */}
								</nav>

								<div className="mt-auto pt-6 flex items-center gap-2 text-slate-500 font-medium text-sm">
									<Globe size={18} />
									<span>Language: English (US)</span>
								</div>
							</div>
						</div>
					</>
				)}
		</header>
	);
};

export default Header;
