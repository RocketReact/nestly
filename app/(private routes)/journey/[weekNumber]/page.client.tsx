"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { WeekSelector } from "@/components/WeekSelector/WeekSelector";
import {
  getWeekGreeting,
  getWeekInfoBaby,
  getWeekInfoMom,
} from "@/lib/api/clientApi";
import { CustomTabs } from "@/components/Tabs/Tabs";
import BabyTabContent from "@/components/Tabs/BabyTabContent";
import MomTabContent from "@/components/Tabs/MomTabContent";
import Loader from "@/components/Loader/Loader";
import Section from "@/components/Section/Section";
import Container from "@/components/Container/Container";
import GreetingBlock from "@/components/GreetingBlock/GreetingBlock";

export default function JourneyDetails() {
  const [tabIndex, setTabIndex] = React.useState(0);

  const router = useRouter();
  const { weekNumber } = useParams<{ weekNumber: string }>();

  const { data: pregnantData } = useQuery({
    queryKey: ["greeting"],
    queryFn: getWeekGreeting,
  });

  const {
    data: babyData,
    isPending: isPendingBaby,
    isError: isErrorBaby,
  } = useQuery({
    queryKey: ["weeks", weekNumber, "baby"],
    queryFn: () => {
      return getWeekInfoBaby({ weekNumber });
    },
  });

  const {
    data: momData,
    isPending: isPendingMom,
    isError: isErrorMom,
  } = useQuery({
    queryKey: ["weeks", weekNumber, "mom"],
    queryFn: () => {
      return getWeekInfoMom({ weekNumber });
    },
  });

  const handleOnCardClick = (weekNumber: number) => {
    router.replace(`/journey/${weekNumber}`);
  };

  const tabData = [
    {
      title: "Розвиток малюка",
      node: babyData && <BabyTabContent data={babyData} />,
      isLoading: isPendingBaby,
      errorMessage: "Щось пішло не так",
      isError: isErrorBaby,
    },
    {
      title: "Тіло мами",
      node: momData && <MomTabContent data={momData} />,
      isLoading: isPendingMom,
      errorMessage: "Щось пішло не так",
      isError: isErrorMom,
    },
  ];

  return (
    <>
      <Section>
        <div></div>
        <Container>
          <GreetingBlock />
          {pregnantData ? (
            <WeekSelector
              curWeekToPregnant={pregnantData.curWeekToPregnant}
              onCardClick={handleOnCardClick}
              selectedWeek={Number(weekNumber)}
              weekQty={
                pregnantData.curWeekToPregnant +
                Math.ceil(pregnantData.daysBeforePregnant / 7)
              }
            />
          ) : (
            <Loader styles={{ margin: "auto" }} />
          )}
          <CustomTabs
            items={tabData}
            tabsProps={{
              selectedIndex: tabIndex,
              onSelect: setTabIndex,
            }}
          />
        </Container>
      </Section>
    </>
  );
}
