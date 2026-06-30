import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Apple, Droplets, Info } from 'lucide-react';

const MemberDiets = () => {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const memberRes = await api.get('/members/me');
        const memberId = memberRes.data.data?._id;
        if (memberId) {
          const response = await api.get(`/diets/member/${memberId}`);
          if (response.data.success) {
            setDiets(response.data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch diets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiets();
  }, []);

  const mealTypeLabels = {
    breakfast: '🌅 Breakfast',
    lunch: '☀️ Lunch',
    dinner: '🌙 Dinner',
    snack: '🍎 Snack',
  };

  const statusColors = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    completed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    paused: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Diets...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">My Diet Plans</h1>
        <p className="text-xs text-zinc-500 mt-1">View nutrition guidelines from your trainer.</p>
      </div>

      <div className="space-y-8">
        {diets.map(plan => (
          <div key={plan._id} className="bg-zinc-900/30 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-emerald-400">{plan.planName}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${statusColors[plan.status] || 'text-zinc-400 bg-zinc-800'}`}>
                    {plan.status}
                  </span>
                  {plan.goal && (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800">
                      Goal: {plan.goal}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-emerald-500/80 uppercase font-bold tracking-wider mb-1">Trainer</p>
                <p className="text-sm font-semibold text-emerald-400">{plan.trainerId?.fullName || plan.trainerId?.name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Meals */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-2">
                    🍽️ Meal Plan
                  </h3>
                  {plan.meals?.map((meal, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">{mealTypeLabels[meal.mealType] || meal.mealType}</h3>
                        {meal.calories && <span className="text-xs font-bold text-orange-400">{meal.calories} kcal</span>}
                      </div>
                      <p className="text-white text-sm font-medium whitespace-pre-wrap">{meal.foodItems}</p>
                      {meal.notes && <p className="text-xs text-zinc-500 mt-2 italic">{meal.notes}</p>}
                    </div>
                  ))}
                  {(!plan.meals || plan.meals.length === 0) && (
                    <p className="text-sm text-zinc-500">No specific meals defined.</p>
                  )}
                </div>

                {/* Macros & Water */}
                <div className="space-y-6">
                  <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-xl">
                    <h3 className="text-base font-bold text-orange-400 flex items-center gap-2 mb-6">
                      <Apple className="w-5 h-5" />
                      Daily Targets
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400 font-semibold uppercase">Calories</span>
                          <span className="text-white font-bold">{plan.calories || 0} kcal</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 w-[100%] rounded-full"></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400 font-semibold uppercase">Protein</span>
                          <span className="text-white font-bold">{plan.protein || 0}g</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[40%] rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400 font-semibold uppercase">Carbs</span>
                          <span className="text-white font-bold">{plan.carbs || 0}g</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 w-[40%] rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400 font-semibold uppercase">Fats</span>
                          <span className="text-white font-bold">{plan.fats || 0}g</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 w-[20%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <Droplets className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400/80 uppercase font-bold tracking-wider">Water Intake</p>
                      <p className="text-lg font-bold text-blue-400">{plan.waterIntake || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {diets.length === 0 && (
          <div className="text-center text-zinc-500 py-16 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl">
            <Apple className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p>You don't have any diet plans assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDiets;
