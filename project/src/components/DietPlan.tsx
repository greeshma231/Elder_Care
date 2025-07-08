import React, { useState, useRef } from 'react';
import {
  Utensils,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Info,
  Settings,
  Check,
  AlertTriangle,
  Heart,
  Thermometer,
  Activity,
  Pill,
  Footprints,
  Eye,
  Smile,
  Meh,
  Frown,
  Gauge,
  Clock,
  User,
  Stethoscope,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Star,
  StarOff,
  Edit3,
  Trash2,
  Search,
  Filter,
  Download,
  Loader2,
  Volume2,
  Mic,
  MicOff,
  Camera,
  Paperclip,
  Save,
  LogOut,
  RefreshCw,
  AlertCircle,
  DivideIcon
} from 'lucide-react';

// Helper function to get status color
const getStatusColor = (isNormal: boolean) =>
  isNormal ? 'text-green-600' : 'text-red-600';

// Helper function to get status background for icons
const getIconBg = (isNormal: boolean) =>
  isNormal ? 'bg-green-100' : 'bg-red-100';

// Helper function to get card border color based on status
const getCardBorder = (isNormal: boolean) =>
  isNormal ? 'border-green-200' : 'border-red-200';

interface Meal {
  id: string;
  time: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  completed: boolean;
}

interface DietPlanDay {
  date: Date;
  meals: Meal[];
}

export const DietPlan: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAllergiesModal, setShowAllergiesModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showCravingsModal, setShowCravingsModal] = useState(false);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [currentCravings, setCurrentCravings] = useState('');
  const [displayedCravings, setDisplayedCravings] = useState('');

  // Mock Data for the Diet Plan - NOW MANAGED BY STATE
  const [dietPlanData, setDietPlanData] = useState<DietPlanDay[]>([
    {
      date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
      meals: [
        {
          id: 'meal_yesterday_1',
          time: '8:00 AM',
          name: 'Yesterday\'s Breakfast',
          description: 'Whole grain oatmeal topped with fresh mixed berries and a drizzle of honey.',
          calories: 300, protein: 10, carbs: 50, fats: 8,
          completed: true, // Marked as completed for a past day
        },
        {
          id: 'meal_yesterday_2',
          time: '1:00 PM',
          name: 'Yesterday\'s Lunch',
          description: 'Mixed greens with grilled chicken breast, cherry tomatoes, cucumber, and a light vinaigrette.',
          calories: 450, protein: 40, carbs: 20, fats: 25,
          completed: false, // Marked as not completed for a past day
        },
        {
          id: 'meal_yesterday_3',
          time: '7:00 PM',
          name: 'Yesterday\'s Dinner',
          description: 'Oven-baked salmon fillet served with steamed asparagus and a side of quinoa.',
          calories: 500, protein: 45, carbs: 30, fats: 28,
          completed: true,
        },
      ],
    },
    {
      date: new Date(), // Today
      meals: [
        {
          id: 'meal1',
          time: '8:00 AM',
          name: 'Oatmeal with Berries',
          description: 'Whole grain oatmeal topped with fresh mixed berries and a drizzle of honey.',
          calories: 300,
          protein: 10,
          carbs: 50,
          fats: 8,
          completed: false,
        },
        {
          id: 'meal2',
          time: '1:00 PM',
          name: 'Grilled Chicken Salad',
          description: 'Mixed greens with grilled chicken breast, cherry tomatoes, cucumber, and a light vinaigrette.',
          calories: 450,
          protein: 40,
          carbs: 20,
          fats: 25,
          completed: false,
        },
        {
          id: 'meal3',
          time: '7:00 PM',
          name: 'Baked Salmon with Asparagus',
          description: 'Oven-baked salmon fillet served with steamed asparagus and a side of quinoa.',
          calories: 500,
          protein: 45,
          carbs: 30,
          fats: 28,
          completed: false,
        },
      ],
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      meals: [
        {
          id: 'meal4',
          time: '8:30 AM',
          name: 'Scrambled Eggs with Spinach',
          description: 'Fluffy scrambled eggs with sautéed spinach and a slice of whole-wheat toast.',
          calories: 320,
          protein: 18,
          carbs: 25,
          fats: 15,
          completed: false,
        },
        {
          id: 'meal5',
          time: '1:30 PM',
          name: 'Lentil Soup',
          description: 'Hearty lentil soup with vegetables, served with a small whole-grain roll.',
          calories: 380,
          protein: 20,
          carbs: 60,
          fats: 10,
          completed: false,
        },
        {
          id: 'meal6',
          time: '6:30 PM',
          name: 'Turkey Meatballs with Zucchini Noodles',
          description: 'Lean turkey meatballs in marinara sauce over fresh zucchini noodles.',
          calories: 480,
          protein: 35,
          carbs: 25,
          fats: 25,
          completed: false,
        },
      ],
    },
  ]);

  const currentDayPlan = dietPlanData.find(
    (plan) => plan.date.toDateString() === currentDate.toDateString()
  );

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const toggleMealCompletion = (mealId: string) => {
    setDietPlanData(prevData =>
      prevData.map(dayPlan => {
        if (dayPlan.date.toDateString() === currentDate.toDateString()) {
          return {
            ...dayPlan,
            meals: dayPlan.meals.map(meal =>
              meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
            )
          };
        }
        return dayPlan;
      })
    );
  };

  const handleAllergiesSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const allergiesInput = formData.get('allergies') as string;
    setAllergies(allergiesInput.split(',').map(item => item.trim()).filter(item => item.length > 0));
    setShowAllergiesModal(false);
  };

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const preferencesInput = formData.get('preferences') as string;
    setPreferences(preferencesInput.split(',').map(item => item.trim()).filter(item => item.length > 0));
    setShowPreferencesModal(false);
  };

  const handleCravingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayedCravings(currentCravings);
    setShowCravingsModal(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Normalize today's date to start of day for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <main className="flex-1 ml-70 p-6 bg-eldercare-background" role="main" aria-label="Diet Plan">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-nunito font-bold text-eldercare-secondary mb-2">
                Personalized Diet Plan
              </h1>
              <p className="text-lg font-opensans text-eldercare-text">
                Healthy meals tailored for you
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAllergiesModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-xl font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:scale-105 shadow-md"
              >
                <AlertTriangle size={20} aria-hidden="true" />
                <span>Allergic To</span>
              </button>
              <button
                onClick={() => setShowPreferencesModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-xl font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:scale-105 shadow-md"
              >
                <Settings size={20} aria-hidden="true" />
                <span>Enter Preferences</span>
              </button>
              {/* New button for Today's Cravings */}
              <button
                onClick={() => setShowCravingsModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-xl font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:scale-105 shadow-md"
              >
                <Utensils size={20} aria-hidden="true" />
                <span>Today's Cravings</span>
              </button>
            </div>
          </div>

          {/* Display Allergies and Preferences */}
          {(allergies.length > 0 || preferences.length > 0 || displayedCravings) && (
            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-4 mb-6">
              {allergies.length > 0 && (
                <p className="text-sm font-opensans text-eldercare-text mb-2">
                  <span className="font-semibold">Allergies:</span> {allergies.join(', ')}
                </p>
              )}
              {preferences.length > 0 && (
                <p className="text-sm font-opensans text-eldercare-text mb-2">
                  <span className="font-semibold">Preferences:</span> {preferences.join(', ')}
                </p>
              )}
              {displayedCravings && (
                <p className="text-sm font-opensans text-eldercare-text">
                  <span className="font-semibold">Today's Cravings:</span> {displayedCravings}
                </p>
              )}
            </div>
          )}
        </header>

        {/* Date Navigation */}
        <section className="mb-8 flex items-center justify-center space-x-4">
          <button
            onClick={goToPreviousDay}
            className="p-3 bg-white rounded-full shadow-md hover:bg-eldercare-primary/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary"
            aria-label="Previous day"
          >
            <ChevronLeft size={24} className="text-eldercare-primary" />
          </button>
          <h2 className="text-2xl font-nunito font-bold text-eldercare-secondary">
            {formatDate(currentDate)}
          </h2>
          <button
            onClick={goToNextDay}
            className="p-3 bg-white rounded-full shadow-md hover:bg-eldercare-primary/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary"
            aria-label="Next day"
          >
            <ChevronRight size={24} className="text-eldercare-primary" />
          </button>
        </section>

        {/* Diet Plan Details */}
        <section aria-labelledby="diet-plan-details-heading">
          <h2 id="diet-plan-details-heading" className="sr-only">Daily Diet Plan</h2>
          {currentDayPlan ? (
            <div className="space-y-6">
              {currentDayPlan.meals.map((meal) => {
                const isPastDay = currentDate.setHours(0, 0, 0, 0) < today.getTime();

                return (
                  <div
                    key={meal.id}
                    className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6 flex items-start space-x-6 hover:shadow-lg transition-all duration-300"
                    role="article"
                    aria-labelledby={`meal-${meal.id}-name`}
                  >
                    <div className="flex-shrink-0">
                      <Utensils size={32} className="text-eldercare-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 id={`meal-${meal.id}-name`} className="text-xl font-nunito font-bold text-eldercare-secondary">
                          {meal.name} <span className="text-base font-opensans font-medium text-eldercare-text-light ml-2">{meal.time}</span>
                        </h3>
                        {isPastDay ? (
                          <div className={`px-3 py-1 rounded-full text-sm font-opensans font-medium ${meal.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {meal.completed ? 'Ate' : 'Not Ate'}
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleMealCompletion(meal.id)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1 ${
                              meal.completed
                                ? 'bg-eldercare-primary border-eldercare-primary'
                                : 'border-eldercare-primary/30 bg-white hover:bg-eldercare-primary/10'
                            }`}
                            aria-label={meal.completed ? `Mark ${meal.name} as incomplete` : `Mark ${meal.name} as complete`}
                          >
                            {meal.completed && <Check size={20} className="text-white" aria-hidden="true" />}
                          </button>
                        )}
                      </div>
                      <p className="text-base font-opensans text-eldercare-text mb-4">
                        {meal.description}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-opensans text-eldercare-text-light">
                        <div>
                          <span className="font-semibold text-eldercare-secondary">Calories:</span> {meal.calories}
                        </div>
                        <div>
                          <span className="font-semibold text-eldercare-secondary">Protein:</span> {meal.protein}g
                        </div>
                        <div>
                          <span className="font-semibold text-eldercare-secondary">Carbs:</span> {meal.carbs}g
                        </div>
                        <div>
                          <span className="font-semibold text-eldercare-secondary">Fats:</span> {meal.fats}g
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-8 text-center">
              <p className="text-lg font-opensans text-eldercare-text">No diet plan available for this date.</p>
            </div>
          )}
        </section>

        {/* Allergies Modal */}
        {showAllergiesModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="allergies-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 id="allergies-modal-title" className="text-xl font-nunito font-bold text-eldercare-secondary">
                  Enter Allergies
                </h3>
                <button
                  onClick={() => setShowAllergiesModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                  aria-label="Close dialog"
                >
                  <X size={24} className="text-eldercare-text" aria-hidden="true" />
                </button>
              </div>
              <form onSubmit={handleAllergiesSave} className="space-y-4">
                <div>
                  <label htmlFor="allergies-input" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2">
                    List any food allergies (comma-separated):
                  </label>
                  <textarea
                    id="allergies-input"
                    name="allergies"
                    rows={3}
                    defaultValue={allergies.join(', ')}
                    className="w-full px-4 py-2 border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                    placeholder="e.g., Peanuts, Dairy, Gluten"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAllergiesModal(false)}
                    className="px-4 py-2 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-sm hover:bg-eldercare-primary/5 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-sm transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preferences Modal */}
        {showPreferencesModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preferences-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 id="preferences-modal-title" className="text-xl font-nunito font-bold text-eldercare-secondary">
                  Enter Food Preferences
                </h3>
                <button
                  onClick={() => setShowPreferencesModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                  aria-label="Close dialog"
                >
                  <X size={24} className="text-eldercare-text" aria-hidden="true" />
                </button>
              </div>
              <form onSubmit={handlePreferencesSave} className="space-y-4">
                <div>
                  <label htmlFor="preferences-input" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2">
                    List any food preferences (comma-separated):
                  </label>
                  <textarea
                    id="preferences-input"
                    name="preferences"
                    rows={3}
                    defaultValue={preferences.join(', ')}
                    className="w-full px-4 py-2 border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                    placeholder="e.g., More vegetables, Less spicy, Chicken"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPreferencesModal(false)}
                    className="px-4 py-2 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-sm hover:bg-eldercare-primary/5 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-sm transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Today's Cravings Modal */}
        {showCravingsModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cravings-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 id="cravings-modal-title" className="text-xl font-nunito font-bold text-eldercare-secondary">
                  What are you craving today?
                </h3>
                <button
                  onClick={() => setShowCravingsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                  aria-label="Close dialog"
                >
                  <X size={24} className="text-eldercare-text" aria-hidden="true" />
                </button>
              </div>
              <form onSubmit={handleCravingsSave} className="space-y-4">
                <div>
                  <label htmlFor="cravings-input" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2">
                    Tell us what you feel like eating today:
                  </label>
                  <textarea
                    id="cravings-input"
                    name="cravings"
                    rows={3}
                    value={currentCravings}
                    onChange={(e) => setCurrentCravings(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                    placeholder="e.g., Something light, A warm soup, Italian food"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCravingsModal(false)}
                    className="px-4 py-2 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-sm hover:bg-eldercare-primary/5 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-sm transition-all duration-300"
                  >
                    Save Cravings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
