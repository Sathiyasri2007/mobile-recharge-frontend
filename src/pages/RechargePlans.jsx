import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePlans } from "../context/PlanContext";
import PlanCard from "../components/PlanCard";

const RechargePlans = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const { plans } = usePlans();

  const filteredPlans =
    selectedCategory === "all"
      ? plans
      : plans.filter((plan) => plan.category === selectedCategory);

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container mx-auto px-4">

        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Recharge Plans
        </h1>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-accent rounded-lg p-1 shadow-md">
            {["all", "prepaid", "postpaid"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-lg"
                    : "text-primary hover:text-accent hover:bg-white/20"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary text-lg">
              No plans found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargePlans;
