import Container from "@/components/Container/Container";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";
import ProfileEditForm from "@/components/ProfileEditForm/ProfileEditForm";
import Section from "@/components/Section/Section";

import { getServerMe } from "@/lib/api/serverApi";

const ProfilePage = async () => {
  const user = await getServerMe();

  return (
    <main>
      <Section>
        <Container>
          <ProfileAvatar user={user} />
          <ProfileEditForm user={user} />
        </Container>
      </Section>
    </main>
  );
};

export default ProfilePage;
