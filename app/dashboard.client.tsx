import BabyTodayCard from "@/components/BabyTodayCard/BabyTodayCard";
import MomTipCard from "@/components/MomTipCard/MomTipCard";
import StatusBlock from "@/components/StatusBlock/StatusBlock";
import TasksReminderCard from "@/components/TasksReminderCard/TasksReminderCard";
import FeelingCheckCard from "@/components/FeelingCheckCard/FeelingCheckCard";
import GreetingBlock from "@/components/GreetingBlock/GreetingBlock";
import Container from "../components/Container/Container";

const DashboardClient = () => {
  return (
    <Container>
      <div>
        <div>
          <GreetingBlock />
          <StatusBlock />
          <BabyTodayCard />
          <MomTipCard />
        </div>
        <div>
          <TasksReminderCard />
          <FeelingCheckCard />
        </div>
      </div>
    </Container>
  );
};

export default DashboardClient;
