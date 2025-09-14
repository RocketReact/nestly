import css from "./SignInPage.module.css";
import Image from "next/image";
import LoginForm from "@/components/LoginForm/LoginForm";
import Link from "next/link";

const SignInPage = () => {
	return (
		<div className={css.container}>
			<div className={css.logo}>
				<Link href="/" aria-label="Home" className={css.logoLink}>
					<Image
						src="/logo.png"
						alt="Лелека"
						width={30}
						height={30}
						priority
					/>
					<span className={css.logoText}>Лелека</span>
				</Link>
			</div>

			<div className={css.formSection}>
				<LoginForm />
			</div>

			<div className={css.imageSection}>
				<Image
					src="/sign-in-img.jpg"
					alt="Яйца в гнезде"
					width={820}
					height={900}
					priority
				/>
			</div>
		</div>
	);
};

export default SignInPage;
