import Container from "@/components/Container/Container";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";
import ProfileEditForm from "@/components/ProfileEditForm/ProfileEditForm";
import Section from "@/components/Section/Section";
import { getServerMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ваш профіль",
  description: "Трішки інформації про Вас",
  openGraph: {
    title: "Ваш профіль",
    description: "Трішки інформації про Вас",
    url: "https://nestly-alpha.vercel.app/profile",
    images: [
      {
        url: "../../../public/sign-up-img.jpg",
        width: 1200,
        height: 630,
        alt: "Ваш профіль",
      },
    ],
  },
};

const ProfilePage = async () => {
  const user = await getServerMe();

  return (
    <Section>
      <Container>
        <div className={css.wrapper}>
          <ProfileAvatar userServer={user} />
          <ProfileEditForm userServer={user} />
        </div>
      </Container>
    </Section>
  );
};

export default ProfilePage;
