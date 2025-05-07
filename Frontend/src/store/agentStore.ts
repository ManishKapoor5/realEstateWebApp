// // src/stores/agentStore.ts
// import { create } from 'zustand';
// import { devtools, persist } from 'zustand/middleware';

// interface Agent {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   specialization?: string;
//   propertiesCount?: number;
//   properties: number;
//   rating: number;
//   status: 'active' | 'inactive';
// }

// interface AgentState {
//   agents: Agent[];
//   isLoading: boolean;
//   error: string | null;
//   fetchAgents: () => Promise<void>;
//   addAgent: (agent: Omit<Agent, 'id'>) => Promise<void>;
//   updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
//   deleteAgent: (id: string) => Promise<void>;
// }

// // Mock API function
// const mockFetchAgents = async (): Promise<Agent[]> => {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   // Return mock data
//   return [
//     {
//       id: '1',
//       name: 'Neha Verma',
//       email: 'neha@example.com',
//       phone: '+91 9876543210',
//       specialization: 'residential',
//       propertiesCount: 8,
//       properties: 8,
//       rating: 4.8,
//       status: 'active'
//     },
//     {
//       id: '2',
//       name: 'Suresh Reddy',
//       email: 'suresh@example.com',
//       phone: '+91 8765432109',
//       specialization: 'commercial',
//       propertiesCount: 5,
//       properties: 5,
//       rating: 4.5,
//       status: 'active'
//     },
//     {
//       id: '3',
//       name: 'Kavita Sharma',
//       email: 'kavita@example.com',
//       phone: '+91 7654321098',
//       specialization: 'plots',
//       propertiesCount: 3,
//       properties: 3,
//       rating: 4.2,
//       status: 'inactive'
//     }
//   ];
// };

// const useAgentStore = create<AgentState>()(
//   devtools(
//     persist(
//       (set) => ({
//         agents: [],
//         isLoading: false,
//         error: null,

//         fetchAgents: async () => {
//           set({ isLoading: true, error: null });
//           try {
//             const agents = await mockFetchAgents();
//             set({ agents, isLoading: false });
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         },

//         addAgent: async (agent) => {
//           set({ isLoading: true, error: null });
//           try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 300));
            
//             const newAgent: Agent = {
//               ...agent,
//               id: Date.now().toString()
//             };
            
//             set(state => ({
//               agents: [...state.agents, newAgent],
//               isLoading: false
//             }));
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         },

//         updateAgent: async (id, updates) => {
//           set({ isLoading: true, error: null });
//           try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 300));
            
//             set(state => ({
//               agents: state.agents.map(agent => 
//                 agent.id === id ? { ...agent, ...updates } : agent
//               ),
//               isLoading: false
//             }));
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         },

//         deleteAgent: async (id) => {
//           set({ isLoading: true, error: null });
//           try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 300));
            
//             set(state => ({
//               agents: state.agents.filter(agent => agent.id !== id),
//               isLoading: false
//             }));
//           } catch (error) {
//             set({ error: (error as Error).message, isLoading: false });
//           }
//         }
//       }),
//       {
//         name: 'agent-storage'
//       }
//     )
//   )
// );

// export default useAgentStore;

// // src/stores/index.ts
// export { default as usePropertyStore } from './propertyStore';
// // export { default as useUserStore } from './userStore';
// // export { default as useAgentStore } from './agentStore';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '@/services/axiosInstance';

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
  propertiesCount?: number;
  properties: number;
  rating: number;
  status: 'active' | 'inactive';
}

interface AgentState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  
  // Methods
  fetchAgents: () => Promise<void>;
  addAgent: (agent: Omit<Agent, '_id'>) => Promise<void>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  getAgents: () => Agent[];
  getAgentById: (id: string) => Agent | undefined;
  getIsLoading: () => boolean;
  getError: () => string | null;
  debugState: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [],
      isLoading: false,
      error: null,

      fetchAgents: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get('/agents');
          set({ agents: response.data.data || [], isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addAgent: async (agent) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post('/agents', agent);
          set((state) => ({
            agents: [...state.agents, response.data.data],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateAgent: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.put(`/agents/${id}`, updates);
          set((state) => ({
            agents: state.agents.map((agent) =>
              agent._id === id ? response.data.data : agent
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      deleteAgent: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete(`/agents/${id}`);
          set((state) => ({
            agents: state.agents.filter((agent) => agent._id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      // Getters
      getAgents: () => get().agents,
      
      getAgentById: (id) => get().agents.find(agent => agent._id === id),
      
      getIsLoading: () => get().isLoading,
      
      getError: () => get().error,
      
      debugState: () => {
        const state = get();
        console.log('Agent Store State:', state);
      }
    }),
    {
      name: 'agent-storage',
      partialize: (state) => ({
        agents: state.agents,
        // Not persisting loading or error states
      }),
    }
  )
);

// Simple initialization - just check if we have agents
export const initializeAgentStore = () => {
  const { agents } = useAgentStore.getState();
  
  if (!agents || agents.length === 0) {
    // Fetch agents on initial load if we don't have any
    useAgentStore.getState().fetchAgents();
  }
};