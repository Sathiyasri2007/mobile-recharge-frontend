import { createContext, useContext, useState, useEffect } from 'react';
import { planAPI } from '../services/api';

const PlanContext = createContext();

export const usePlans = () => useContext(PlanContext);

export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await planAPI.getPlans();
      const planData = response.data.plans || response.data.data || response.data || [];
      setPlans(Array.isArray(planData) ? planData : []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]);
    }
  };

  const addPlan = async (plan) => {
    try {
      const response = await planAPI.addPlan(plan);
      const newPlan = response.data.data || response.data;
      setPlans([...plans, newPlan]);
    } catch (error) {
      console.error('Failed to add plan:', error);
      throw error;
    }
  };

  const updatePlan = async (id, updatedPlan) => {
    try {
      const response = await planAPI.updatePlan(id, updatedPlan);
      const updated = response.data.data || response.data;
      setPlans(plans.map(plan => plan._id === id ? updated : plan));
    } catch (error) {
      console.error('Failed to update plan:', error);
      throw error;
    }
  };

  const deletePlan = async (id) => {
    try {
      await planAPI.deletePlan(id);
      setPlans(plans.filter(plan => plan._id !== id));
    } catch (error) {
      console.error('Failed to delete plan:', error);
      throw error;
    }
  };

  return (
    <PlanContext.Provider value={{ plans, addPlan, updatePlan, deletePlan }}>
      {children}
    </PlanContext.Provider>
  );
};