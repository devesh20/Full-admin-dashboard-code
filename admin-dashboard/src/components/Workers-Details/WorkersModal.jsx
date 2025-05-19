import React, {useState} from 'react'
import {
    Modal,
    ModalDialog, 
    ModalClose ,
    Typography, 
    FormControl, 
    FormLabel, 
    Input, 
    Stack,  
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    Option
} from '@mui/joy'
import { Button } from '../ui/button';
import { useNavigate, useHref, Form , useLoaderData} from 'react-router-dom'; 
import { Inventory } from '@mui/icons-material';

function WorkersModal() {
    const href = useHref()
    // console.log(href.split('/').reverse());

    const data = useLoaderData()
    // console.log("workersmodal",data)
    // console.log("object data");
    
    const navigate = useNavigate()
    const handleClose = () => {
        navigate(-1)
    }

    const [jobType, setJobType] = useState(""); 
    const isEdit = Boolean(data)

    const handleChange = (event) => {
      setJobType(event.target.value);
      console.log('Selected job type:', event.target.value);
    };

  return (
    <Modal onClose={handleClose} open>
      <ModalDialog>
        <ModalClose />
        {href.includes('delete') ? (
          <>
            <DialogTitle sx={{ mb: 2 }}>Confirmation</DialogTitle>
            <DialogContent>Are you sure you want to delete?</DialogContent>
            <DialogActions>
              <Form method="post">
                <Button type="submit" className="bg-red-500 text-white cursor-pointer">
                  Delete
                </Button>
              </Form>
              <Button onClick={handleClose} className="bg-gray-500 text-white cursor-pointer">
                Cancel
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <span className="text-center font-bold capitalize">
              {isEdit ? "Update Worker" : "Add New Worker"}
            </span>
              <Form method="post" autoComplete="off" onSubmit={(e) => {
                const form = e.currentTarget;
                if (!form.checkValidity()) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}>
              <Stack spacing={2}>
                <FormControl error={false}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    required
                    defaultValue={data?.userName}
                    placeholder="Enter Name"
                    name="userName"
                    slotProps={{
                      input: {
                        minLength: 2,
                        maxLength: 50
                      }
                    }}
                    error={false}
                  />
                </FormControl>

                <FormControl error={false}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    required
                    type="tel"
                    defaultValue={data?.phoneNumber}
                    placeholder="Enter Phone Number"
                    pattern="[0-9]{10,12}"
                    name="phoneNumber"
                    slotProps={{
                      input: {
                        minLength: 10,
                        maxLength: 12
                      }
                    }}
                    error={false}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!/^\d*$/.test(value)) {
                        e.target.setCustomValidity("Please enter only numbers");
                      } else if (value.length < 10) {
                        e.target.setCustomValidity("Phone number must be at least 10 digits");
                      } else if (value.length > 12) {
                        e.target.setCustomValidity("Phone number must not exceed 12 digits");
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }}
                  />
                </FormControl>
                
                {!isEdit && (<FormControl error={false}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    required
                    type="password"
                    defaultValue={data?.password}
                    placeholder="Enter Password"
                    name="password"
                    slotProps={{
                      input: {
                        minLength: 6
                      }
                    }}
                    error={false}
                    onChange={(e) => {
                      if (e.target.value.length < 6) {
                        e.target.setCustomValidity("Password must be at least 6 characters");
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }}
                  />
                </FormControl>)
                }
                
                <FormControl error={false}>
                  <FormLabel>Job Type</FormLabel>
                  <Select
                    required
                    name="jobType" 
                    placeholder="Select job type"
                    defaultValue={data?.jobType} 
                    sx={{ width: '100%' }}
                    onChange={handleChange}
                    error={false}
                  >
                    <Option value="Inventory">Inventory</Option>
                    <Option value="Die Casting">Die Casting</Option>
                    <Option value="Shot Blasting">Shot Blasting</Option>
                    <Option value="Flatling">Flatling</Option>
                  </Select>
                </FormControl>

                
                <Button type="submit" className='bg-black text-white cursor-pointer'>
                  {data ? "Update Worker" : "Add New Worker"}
                </Button>
              </Stack>
            </Form>

            {/* <Form method="post" autoComplete="off">
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>User Name</FormLabel>
                  <Input
                    required
                    defaultValue={data?.userName}
                    placeholder="Enter User Name"
                    name="userName"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    required
                    type="number"
                    defaultValue={data?.phoneNumber}
                    placeholder="Enter Phone Number"
                    name="phoneNumber"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    required
                    type="password"
                    defaultValue={data?.password}
                    placeholder="Enter Password"
                    name="password"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Job</FormLabel>
                  <Input
                    required
                    type="text"
                    // defaultValue={data?.password}
                    placeholder="Enter Job type"
                    name="jobType"
                  />
                </FormControl>
                
                <Button type="submit">
                  {data ? "Update Wroker" : "Create New Worker"}
                </Button>
              </Stack>
            </Form> */}
          </>
        )}
      </ModalDialog>
    </Modal>
  );
}

export default WorkersModal