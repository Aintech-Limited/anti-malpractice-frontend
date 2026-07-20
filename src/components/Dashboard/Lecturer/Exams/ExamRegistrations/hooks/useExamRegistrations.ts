"use client";

import { useState } from "react";
import { IExamRegistration } from "../interface";

export const useExamRegistrations = (
  initialRegistrations: IExamRegistration[],
  initialMeta: any,
) => {
  const [registrations, setRegistrations] =
    useState<IExamRegistration[]>(initialRegistrations);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<IExamRegistration | null>(null);

  const updateRegistrations = (
    newRegistrations: IExamRegistration[],
    newMeta: any,
  ) => {
    setRegistrations(newRegistrations);
    setMeta(newMeta);
  };

  const setLoadingState = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const selectRegistration = (registration: IExamRegistration | null) => {
    setSelectedRegistration(registration);
  };

  return {
    registrations,
    meta,
    loading,
    selectedRegistration,
    updateRegistrations,
    setLoadingState,
    selectRegistration,
  };
};
