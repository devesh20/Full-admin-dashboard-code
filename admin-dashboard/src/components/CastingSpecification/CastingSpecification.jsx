// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Plus, Trash } from "lucide-react";

// const predefinedImages = [
//   { id: 1, url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqarAl5tVFI1XtTpcPLZMDTD0cxZnS5NXrBg&s", name: "Casting A" },
//   { id: 2, url: "https://fractory.com/wp-content/uploads/2024/08/die-casting-process-scheme-1-e1724677125958.jpg", name: "Casting B" },
//   { id: 3, url: "https://www.iqsdirectory.com/articles/die-casting/zinc-die-casting/cold-chamber-die-casting.jpg", name: "Casting C" },
//   { id: 4, url: "https://www.azom.com/images/Article_Images/ImageForArticle_1392_4511939588817133567.gif", name: "Casting D" },
// ];
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import axios from 'axios';

const CastingSpecification = () => {
  const [items, setItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ image: null, castingName: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.image || !formData.castingName) {
      return alert("Please provide both image and casting name");
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', formData.image);
      formDataToSend.append('castingName', formData.castingName);

      if (isEditing) {
        // Update existing item
        const response = await axios.put(`/api/casting-specification/${editItemId}`, formDataToSend);
        setItems(items.map(item => item.id === editItemId ? response.data : item));
      } else {
        // Create new item
        const response = await axios.post('/api/casting-specification', formDataToSend);
        setItems([...items, response.data]);
      }

      setFormData({ image: null, castingName: '' });
      setDialogOpen(false);
      setIsEditing(false);
      setEditItemId(null);
    } catch (error) {
      console.error('Error saving casting specification:', error);
      alert('Error saving casting specification');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/casting-specification/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting casting specification:', error);
      alert('Error deleting casting specification');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      image: null,
      castingName: item.castingName
    });
    setEditItemId(item.id);
    setIsEditing(true);
    setDialogOpen(true);
  };

  return (
    <div className="p-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-black text-white cursor-pointer">{isEditing ? "Edit" : "Add"}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Add"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Casting Name</label>
              <Input
                value={formData.castingName}
                onChange={(e) => setFormData(prev => ({ ...prev, castingName: e.target.value }))}
                placeholder="Enter casting name"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Upload Image</label>
              <div className="relative aspect-square w-full max-w-[200px] mx-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500">Click to upload image</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSubmit} className="w-full bg-black text-white cursor-pointer">
              {isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Display submitted items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {items.map(item => (
          <Card key={item.id}>
            <CardContent className="p-3">
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img src={item.imageUrl} alt={item.castingName} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium mt-2">{item.castingName}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CastingSpecification;

// const CastingSpecification = () => {
//   const [castingItems, setCastingItems] = useState([
//     { id: 1, imageUrl: "", processName: "", description: "", material: "" }
//   ]);

//   const addCastingProcess = () => {
//     setCastingItems([...castingItems, { id: Date.now(), imageUrl: "", processName: "", description: "", material: "" }]);
//   };

//   const removeCastingProcess = (id) => {
//     setCastingItems(castingItems.filter((item) => item.id !== id));
//   };

//   const updateField = (id, field, value) => {
//     setCastingItems(
//       castingItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
//     );
//   };

//   return (
//     <div className="w-full my-1 mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Casting Specification</h1>
//       {castingItems.map((item) => (
//         <Card key={item.id} className="mb-6">
//           <CardHeader className="flex justify-between items-center">
//             <CardTitle>Casting Process {item.id}</CardTitle>
//             {castingItems.length > 1 && (
//               <Button className="bg-white text-red-500 cursor-pointer" size="icon" onClick={() => removeCastingProcess(item.id)}>
//                 <Trash size={20} />
//               </Button>
//             )}
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               {/* <label className="block text-sm font-medium">Process Image</label> */}
//               {item.imageUrl ? (
//                 <img src={item.imageUrl} alt="Casting" className="h-40 w-full object-cover rounded mb-2" />
//               ) : (
//                 <div className="h-40 w-full bg-gray-100 flex items-center justify-center rounded mb-2">
//                   <span className="text-gray-400">No image selected</span>
//                 </div>
//               )}
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" className="w-full">Choose Template</Button>
//                 </DialogTrigger>
//                 <DialogContent className="grid grid-cols-2 gap-2 p-4 bg-white">
//                   {predefinedImages.map((image) => (
//                     <div key={image.id} onClick={() => updateField(item.id, "imageUrl", image.url)} className="cursor-pointer">
//                       <img src={image.url} alt={image.name} className="h-20 w-full object-cover rounded mb-1 border-1" />
//                       <p className="text-xs text-center">{image.name}</p>
//                     </div>
//                   ))}
//                 </DialogContent>
//               </Dialog>
//               <Input type="file" accept="image/*" className="mt-2" onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   const imageUrl = URL.createObjectURL(file);
//                   updateField(item.id, "imageUrl", imageUrl);
//                 }
//               }} />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium">Process Name</label>
//               <Input placeholder="Process Name" value={item.processName} onChange={(e) => updateField(item.id, "processName", e.target.value)} />
//               <label className="block text-sm font-medium">Material</label>
//               <Input placeholder="Material" value={item.material} onChange={(e) => updateField(item.id, "material", e.target.value)} />
//               <label className="block text-sm font-medium">Description</label>
//               <Textarea placeholder="Process Description" value={item.description} onChange={(e) => updateField(item.id, "description", e.target.value)} />
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//       <Button onClick={addCastingProcess} className="w-full flex items-center gap-2 bg-black text-white cursor-pointer">
//         <Plus size={18} /> Add Casting Process
//       </Button>
//     </div>
//   );
// };

// export default CastingSpecification;