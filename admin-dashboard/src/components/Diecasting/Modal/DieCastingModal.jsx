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
import { useHref, useLoaderData, useNavigate , Form, useParams, useOutletContext} from 'react-router-dom'
import axios from 'axios'

function DieCastingModal() {
    const href = useHref();
    const data = useLoaderData();
    const { id } = useParams()
    const { refreshData } = useOutletContext()

    const navigate = useNavigate();
    const handleClose = () => {
      navigate(-1);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const updateData = Object.fromEntries(formData.entries());
        console.log(updateData);
        
        
      try {
        if (href.includes('update')) {
          console.log(`Updating diecasting with ID: ${id}`);
          const response = await axios.put(`/api/diecasting/update/${id}`, updateData);
          console.log("Update response:", response.data);
        } else if (href.includes('delete')) {
          console.log(`Deleting diecasting with ID: ${id}`);
          const response = await axios.delete(`/api/diecasting/delete/${id}`);
          console.log("Delete response:", response.data);
        }

        handleClose();
        // Give the backend time to process
        refreshData();
      } catch (error) {
        console.error('Error:', error);
        console.error('Error details:', error.response?.data || error.message);
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
              <Form method="delete" onSubmit={handleFormSubmit}>
                <Button
                  type="submit"
                  className="bg-red-500 text-white cursor-pointer"
                >
                  Delete
                </Button>
              </Form>
              <Button
                onClick={handleClose}
                className="bg-gray-500 text-white cursor-pointer"
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        ) : (
          <div className="flex flex-col overflow-auto">
            <span className="text-center font-bold capitalize">
              {href.includes('edit') ? 'Edit Die Casting' : 'Die Casting'}
            </span>
            <Form method="put" autoComplete="off" onSubmit={handleFormSubmit}>
              <Stack spacing={2} gridColumn={2}>
                <FormControl>
                  <FormLabel>Casting Name</FormLabel>
                  <Input
                    required
                    defaultValue={data?.castingName}
                    placeholder="Enter Casting Name"
                    name="castingName"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Quantity Produced</FormLabel>
                  <Input
                    required
                    defaultValue={data?.quantityProduced}
                    placeholder="Enter Quantity produced"
                    name="quantityProduced"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Quantity Produced(KG)</FormLabel>
                  <Input
                    required
                    defaultValue={data?.quantityProducedKG}
                    placeholder="Enter Quantity produced in KG"
                    name="quantityProducedKG"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Shift of Production</FormLabel>
                  <Input
                    required
                    defaultValue={data?.shiftOfProduction}
                    placeholder="Enter Shift of Production"
                    name="shiftOfProduction"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Machine Number</FormLabel>
                  <Input
                    required
                    defaultValue={data?.machineNumber}
                    placeholder="Enter Machinee Number"
                    name="machineNumber"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Furnace Temperature</FormLabel>
                  <Input
                    required
                    defaultValue={data?.furnaceTemperature}
                    placeholder="Enter Furnace Temperature"
                    name="furnaceTemperature"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Die Temperature</FormLabel>
                  <Input
                    required
                    defaultValue={data?.dyeTemperature}
                    placeholder="Enter Die Temperature"
                    name="dyeTemperature"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Quantity Rejected</FormLabel>
                  <Input
                    required
                    defaultValue={data?.quantityRejected}
                    placeholder="Enter Quantity Rejected"
                    name="quantityRejected"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Rejection Cause</FormLabel>
                  <Input
                    required
                    defaultValue={data?.rejectionCause}
                    placeholder="Enter Rejection Cause"
                    name="rejectionCause"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Time To Fix</FormLabel>
                  <Input
                    required
                    defaultValue={data?.timeToFix}
                    placeholder="Enter Time to Fix"
                    name="timeToFix"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Machine Defect Cause</FormLabel>
                  <Input
                    required
                    defaultValue={data?.machineDefectCause}
                    placeholder="Enter Machine Defect Cause"
                    name="machineDefectCause"
                  />
                </FormControl>
                <Button
                  type="submit"
                  className="bg-black text-white cursor-pointer"
                >
                  {data ? "Update" : "No data available"}
                </Button>
              </Stack>
            </Form>
          </div>
        )}
      </ModalDialog>
    </Modal>
  );
}

export default DieCastingModal