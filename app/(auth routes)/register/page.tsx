import css from "./SignUpPage.module.css";
import Image from "next/image";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import Link from "next/link";

const SignUpPage = () => {
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
				<RegisterForm />
			</div>

			<div className={css.imageSection}>
				<Image
					src="/sign-up-img.jpg"
					alt="Аисты"
					width={720}
					height={900}
					priority
				/>
			</div>
		</div>
	);
};

export default SignUpPage;
