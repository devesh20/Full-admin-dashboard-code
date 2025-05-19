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
          if (href.includes("material-received") && href.includes("delete")){
            await axios.delete(`/api/material-recieved/delete/${id}`);
          } else if(href.includes('material-received')) {
            await axios.put(`/api/material-received/edit/${id}`, updateData);
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
                {href.includes('edit') ? 'Edit Material Received' : 'Material Received'}
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
                  <FormLabel>Supplier Name</FormLabel>
                  <Input
                    required
                    defaultValue={data?.supplierName}
                    placeholder="Enter Supplier Name"
                    name="supplierName"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Purchase Ord. No.</FormLabel>
                  <Input
                    required
                    defaultValue={data?.purchaseOrderNumber}
                    placeholder="Enter Purchase Order No."
                    name="purchaseOrderNumber"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Challan No.</FormLabel>
                  <Input
                    required
                    defaultValue={data?.challanNumber}
                    placeholder="Enter Challan No."
                    name="challanNumber"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>LOT No.</FormLabel>
                  <Input
                    required
                    defaultValue={data?.materialLotNumber}
                    placeholder="Enter LOT No."
                    name="materialLotNumber"
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
                <FormControl>
                  <FormLabel>Allocated location</FormLabel>
                  <Input
                    required
                    defaultValue={data?.locationAllocated}
                    placeholder="Enter Allocated Location"
                    name="locationAllocated"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Weight Discrepancy</FormLabel>
                  <Input
                    required
                    defaultValue={data?.weightDiscrepancy}
                    placeholder="Enter Weight Discrepancy"
                    name="weightDiscrepancy"
                  />
                </FormControl>
                <Button type="submit" className='bg-black text-white cursor-pointer'>
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