import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Clock, Users } from '@phosphor-icons/react';

// Pre-loaded cookie recipes
const defaultRecipes = [
  {
    id: 1,
    name: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    prepTime: "15 min",
    servings: "24 cookies",
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "¾ cup granulated sugar",
      "¾ cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Mix flour, baking soda, and salt in a bowl.",
      "Beat butter and both sugars until creamy.",
      "Beat in eggs and vanilla.",
      "Gradually blend in flour mixture.",
      "Stir in chocolate chips.",
      "Drop rounded tablespoons onto ungreased cookie sheets.",
      "Bake 9-11 minutes until golden brown.",
      "Cool on baking sheet for 2 minutes before removing."
    ]
  },
  {
    id: 2,
    name: "Oatmeal Raisin Cookies",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
    prepTime: "20 min",
    servings: "30 cookies",
    ingredients: [
      "1 cup butter, softened",
      "1 cup brown sugar",
      "½ cup granulated sugar",
      "2 large eggs",
      "1 tsp vanilla extract",
      "1½ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp cinnamon",
      "½ tsp salt",
      "3 cups old-fashioned oats",
      "1 cup raisins"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "Beat butter and both sugars until fluffy.",
      "Beat in eggs and vanilla.",
      "Combine flour, baking soda, cinnamon, and salt.",
      "Gradually add to butter mixture.",
      "Stir in oats and raisins.",
      "Drop rounded tablespoons onto ungreased baking sheets.",
      "Bake 10-12 minutes until edges are lightly browned.",
      "Cool on pan for 2 minutes before transferring."
    ]
  },
  {
    id: 3,
    name: "Sugar Cookies",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    prepTime: "25 min",
    servings: "36 cookies",
    ingredients: [
      "2¾ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp baking powder",
      "1 cup butter, softened",
      "1½ cups white sugar",
      "1 egg",
      "1 tsp vanilla extract",
      "Additional sugar for rolling"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Mix flour, baking soda, and baking powder.",
      "Cream butter and sugar until light and fluffy.",
      "Beat in egg and vanilla.",
      "Gradually blend in flour mixture.",
      "Roll dough into walnut-sized balls.",
      "Roll in sugar and place on ungreased baking sheets.",
      "Bake 10-12 minutes until lightly golden.",
      "Cool on wire racks."
    ]
  },
  {
    id: 4,
    name: "Peanut Butter Cookies",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    prepTime: "15 min",
    servings: "24 cookies",
    ingredients: [
      "1 cup peanut butter",
      "1 cup granulated sugar",
      "1 large egg",
      "1 tsp vanilla extract",
      "½ tsp baking soda",
      "Pinch of salt"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "Mix all ingredients in a bowl until well combined.",
      "Roll dough into 1-inch balls.",
      "Place on ungreased baking sheet.",
      "Press with fork to create crosshatch pattern.",
      "Bake 10-12 minutes until edges are set.",
      "Cool on baking sheet for 5 minutes.",
      "Transfer to wire rack to cool completely."
    ]
  },
  {
    id: 5,
    name: "Snickerdoodles",
    image: "https://images.unsplash.com/photo-1549116937-15b5ec6de733?w=400&h=300&fit=crop",
    prepTime: "20 min",
    servings: "30 cookies",
    ingredients: [
      "2¾ cups all-purpose flour",
      "2 tsp cream of tartar",
      "1 tsp baking soda",
      "½ tsp salt",
      "1 cup butter, softened",
      "1½ cups sugar",
      "2 large eggs",
      "2 tbsp sugar mixed with 2 tsp cinnamon for rolling"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Mix flour, cream of tartar, baking soda, and salt.",
      "Beat butter and sugar until fluffy.",
      "Beat in eggs one at a time.",
      "Gradually blend in flour mixture.",
      "Shape dough into 1-inch balls.",
      "Roll in cinnamon-sugar mixture.",
      "Place on ungreased baking sheets.",
      "Bake 8-10 minutes until set but not too hard."
    ]
  }
];

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(defaultRecipes[0]);
  const [customRecipes, setCustomRecipes] = useKV('custom-recipes', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    image: '',
    prepTime: '',
    servings: '',
    ingredients: '',
    instructions: ''
  });

  const allRecipes = [...defaultRecipes, ...customRecipes];
  const canAddMore = allRecipes.length < 7;

  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions) {
      return;
    }

    const recipe = {
      id: Date.now(),
      name: newRecipe.name,
      image: newRecipe.image || "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
      prepTime: newRecipe.prepTime || "30 min",
      servings: newRecipe.servings || "24 cookies",
      ingredients: newRecipe.ingredients.split('\n').filter(i => i.trim()),
      instructions: newRecipe.instructions.split('\n').filter(i => i.trim())
    };

    setCustomRecipes(current => [...current, recipe]);
    setSelectedRecipe(recipe);
    setNewRecipe({ name: '', image: '', prepTime: '', servings: '', ingredients: '', instructions: '' });
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Cool Cookies</h1>
              <p className="text-muted-foreground mt-2">Delicious cookie recipes for every occasion</p>
            </div>
            {canAddMore && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Recipe
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Cookie Recipe</DialogTitle>
                    <DialogDescription>
                      Create your own cookie recipe to add to the collection.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipe-name">Recipe Name *</Label>
                        <Input
                          id="recipe-name"
                          placeholder="e.g., Double Chocolate Cookies"
                          value={newRecipe.name}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipe-image">Image URL</Label>
                        <Input
                          id="recipe-image"
                          placeholder="https://example.com/image.jpg"
                          value={newRecipe.image}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, image: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prep-time">Prep Time</Label>
                        <Input
                          id="prep-time"
                          placeholder="e.g., 20 min"
                          value={newRecipe.prepTime}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, prepTime: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="servings">Servings</Label>
                        <Input
                          id="servings"
                          placeholder="e.g., 24 cookies"
                          value={newRecipe.servings}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, servings: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ingredients">Ingredients *</Label>
                      <Textarea
                        id="ingredients"
                        placeholder="Enter each ingredient on a new line"
                        className="min-h-32"
                        value={newRecipe.ingredients}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, ingredients: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions *</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Enter each step on a new line"
                        className="min-h-32"
                        value={newRecipe.instructions}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, instructions: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRecipe}>Add Recipe</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe List */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Cookie Recipes</h2>
                <span className="text-sm text-muted-foreground">
                  {allRecipes.length}/7 recipes
                </span>
              </div>
              
              <div className="space-y-3">
                {allRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedRecipe.id === recipe.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {recipe.prepTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          {recipe.servings}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              
              {!canAddMore && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground text-sm">
                      Maximum of 7 recipes reached
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recipe Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img
                      src={selectedRecipe.image}
                      alt={selectedRecipe.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <CardTitle className="text-3xl mb-2">{selectedRecipe.name}</CardTitle>
                    <div className="flex items-center gap-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={20} />
                        <span>{selectedRecipe.prepTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={20} />
                        <span>{selectedRecipe.servings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1.5 text-xs">●</span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                    <ol className="space-y-3">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="bg-primary text-primary-foreground text-sm font-medium px-2 py-1 rounded-full min-w-6 text-center">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;