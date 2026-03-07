import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { X, Plus, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ALL_TAGS } from "@/lib/constants";
import type { Ingredient } from "@/types/recipe";

interface CreateRecipeDialogProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateRecipeDialog = ({ onClose, onSubmit }: CreateRecipeDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "", unit: "" }]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const removeIngredient = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[i] = { ...updated[i], [field]: value };
    setIngredients(updated);
  };

  const addStep = () => setInstructions([...instructions, ""]);
  const removeStep = (i: number) => setInstructions(instructions.filter((_, idx) => idx !== i));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      tags: selectedTags,
      ingredients: ingredients.filter((i) => i.name),
      instructions: instructions.filter((s) => s),
      prepTime: Number(prepTime),
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty,
      imageFile,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 backdrop-blur-sm p-4 pt-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative w-full max-w-2xl bg-background rounded-2xl overflow-hidden mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-2xl font-bold">Create Recipe</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image Upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-10 w-10" />
                <p className="font-medium">Drop your food photo here</p>
                <p className="text-sm">or click to browse</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Recipe name" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe your recipe" rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Prep Time (min)</label>
              <Input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Cook Time (min)</label>
              <Input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Servings</label>
              <Input type="number" value={servings} onChange={(e) => setServings(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Difficulty</label>
              <div className="flex gap-1">
                {(["Easy", "Medium", "Hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      difficulty === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Ingredient"
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Qty"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                    className="w-20"
                  />
                  <Input
                    placeholder="Unit"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                    className="w-20"
                  />
                  {ingredients.length > 1 && (
                    <button onClick={() => removeIngredient(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addIngredient} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Ingredient
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Instructions</label>
            <div className="space-y-2">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-2">
                    {i + 1}
                  </span>
                  <Textarea
                    value={step}
                    onChange={(e) => {
                      const updated = [...instructions];
                      updated[i] = e.target.value;
                      setInstructions(updated);
                    }}
                    placeholder={`Step ${i + 1}`}
                    rows={2}
                    className="flex-1"
                  />
                  {instructions.length > 1 && (
                    <button onClick={() => removeStep(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg mt-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addStep} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Step
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title}>Publish Recipe</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateRecipeDialog;
