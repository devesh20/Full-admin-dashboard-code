import React,{useState} from 'react'
import {
    Modal,
    ModalDialog, 
    ModalClose ,
    FormControl, 
    FormLabel, 
    Input, 
    Stack,  
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/joy'
import { Button } from '@/components/ui/button'
import { useHref, useLoaderData, useNavigate , Form, useOutletContext, useParams} from 'react-router-dom'
import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:3000'

function InventoryModal() {
    const href = useHref()
    // console.log(href.split('/').reverse());

    const data = useLoaderData()
    const { id } = useParams()
    const { refreshData } = useOutletContext()
    
    const navigate = useNavigate()
    const handleClose = () => {
        navigate(-1)
    }

    const handleFormSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);

      const updateData = Object.fromEntries(formData.entries());
      
      try {
          if (href.includes('material-issued') && href.includes('delete')) {
              await axios.delete(`/api/material-issued/delete/${id}`);
          } else if (href.includes('material-issued')) {
              await axios.put(`/api/material-issued/edit/${id}`, updateData);
          }
          
          handleClose();
          setTimeout(() => {
              refreshData();
          }, 100);
      } catch (error) {
          console.error('Error updating/deleting:', error);
      }
    }

  return (
    <Modal onClose={handleClose} open>
      <ModalDialog sx={{ width: "500px" }}>
        <ModalClose />
        {href.includes('delete') ? (
          <>
            <DialogTitle sx={{ mb: 2 }}>Confirmation</DialogTitle>
            <DialogContent>Are you sure you want to delete?</DialogContent>
            <DialogActions>
              <Form method='delete' onSubmit={handleFormSubmit}>
                <Button type='submit' className="bg-red-500 text-white cursor-pointer">
                  Delete
                </Button>
              </Form>
              <Button onClick={handleClose} className="bg-gray-500 text-white cursor-pointer">
                Cancel
              </Button>
            </DialogActions>
          </>
        ) : (
          <div className='flex flex-col overflow-auto'>
            <span className='text-center font-bold capitalize'>
              {href.includes('edit') ? 'Edit Material Issued' : 'Material Issued'}
            </span>
            <Form method="put" autoComplete='off' onSubmit={handleFormSubmit}>
              <Stack spacing={2} gridColumn={2}>
                <FormControl>
                  <FormLabel>Material Grade</FormLabel>
                  <Input
                    required
                    defaultValue={data?.materialGrade}
                    placeholder="Enter Material Grade"
                    name="materialGrade"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Allocated Location</FormLabel>
                  <Input
                    required
                    defaultValue={data?.locationOfMaterial}
                    placeholder="Enter Supplier Name"
                    name="locationOfMaterial"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Shift of Production</FormLabel>
                  <Input
                    required
                    defaultValue={data?.shiftOfProduction}
                    placeholder="Enter Password"
                    name="shiftOfProduction"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Material Quantity</FormLabel>
                  <Input
                    required
                    defaultValue={data?.materialQuantity}
                    placeholder="Enter Material Quantity"
                    name="materialQuantity"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Material Quantity (KG)</FormLabel>
                  <Input
                    required
                    defaultValue={data?.materialQuantityKG}
                    placeholder="Enter Material Quantity in KG"
                    name="materialQuantityKG"
                  />
                </FormControl>
                <Button type="submit" className="bg-black text-white cursor-pointer">
                  {data ? "Update Inventory" : "No data available"}
                </Button>
              </Stack>
            </Form>
          </div>
        )}
      </ModalDialog>
    </Modal>
  )
}

export default InventoryModal