import { create } from 'zustand';
import { Topic } from '@/types';
import { apiClient } from '@/services/apiClient';

interface TopicState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  fetchTopicsByStudent: (studentId: string) => Promise<void>;
  fetchTopicsBySupervisor: (supervisorId: string) => Promise<void>;
  addTopic: (topic: Topic) => void;
}

export const useTopicStore = create<TopicState>((set) => ({
  topics: [],
  loading: false,
  error: null,

  fetchTopics: async () => {
    set({ loading: true, error: null });
    try {
      const topics = await apiClient.getTopics();
      set({ topics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchTopicsByStudent: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const topics = await apiClient.getTopicsByStudent(studentId);
      set({ topics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchTopicsBySupervisor: async (supervisorId: string) => {
    set({ loading: true, error: null });
    try {
      const topics = await apiClient.getTopicsBySupervisor(supervisorId);
      set({ topics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTopic: (topic: Topic) => {
    set((state) => ({ topics: [...state.topics, topic] }));
  },
}));
