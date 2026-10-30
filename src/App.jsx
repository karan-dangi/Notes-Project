import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const App = () => {
  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Stores the input text for the note heading
  const [title, setTitle] = useState('')
  
  // Stores the textarea text for the note description
  const [details, setDetails] = useState('')
  
  // Stores the list of all note objects [{ id, title, details }, ...]
  const [task, setTask] = useState([])
  
  // Stores the ID of the note being edited. 
  // null = creating new note | number = updating existing note
  const [editId, setEditId] = useState(null)

  // ---------------------------------------------------------------------------
  // 2. FORM SUBMISSION (ADD OR UPDATE)
  // ---------------------------------------------------------------------------
  const submitHandler = (e) => {
    e.preventDefault() // Prevents default browser page refresh on form submit

    // Don't save if both title and details are empty
    if (!title.trim() && !details.trim()) return

    if (editId !== null) {
      // --- UPDATE MODE ---
      // Loop through array with .map(). If ID matches editId, update title/details.
      setTask((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, title, details } : item
        )
      )
      // Reset editId back to null to exit edit mode
      setEditId(null)
    } else {
      // --- ADD MODE ---
      // Add new note to the end of array with a unique timestamp ID
      setTask((prev) => [...prev, { id: Date.now(), title, details }])
    }

    // Clear input fields after adding or updating
    setTitle('')
    setDetails('')
  }

  // ---------------------------------------------------------------------------
  // 3. EDIT HANDLER
  // ---------------------------------------------------------------------------
  const handleEdit = (note) => {
    // Populate form fields with the selected note's data
    setTitle(note.title)
    setDetails(note.details)
    
    // Save note ID into editId state to activate Edit Mode
    setEditId(note.id)
  }

  // ---------------------------------------------------------------------------
  // 4. CANCEL EDIT HANDLER
  // ---------------------------------------------------------------------------
  const handleCancelEdit = () => {
    // Clear form inputs and exit edit mode
    setTitle('')
    setDetails('')
    setEditId(null)
  }

  // ---------------------------------------------------------------------------
  // 5. DELETE HANDLER
  // ---------------------------------------------------------------------------
  const deletNote = (id) => {
    // If user deletes the note currently open in the edit form, cancel edit mode first
    if (editId === id) {
      handleCancelEdit()
    }
    
    // Filter out the note matching the given ID
    setTask((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className='h-screen lg:flex bg-black text-white'>
      
      {/* ---------------------------------------------------------------------
          FORM SECTION (LEFT PANEL)
         --------------------------------------------------------------------- */}
      <form
        onSubmit={submitHandler}
        className='flex gap-4 lg:w-1/2 flex-col items-start p-10'
      >
        {/* Dynamic heading depending on edit state */}
        <h1 className='text-3xl font-bold'>
          {editId !== null ? 'Edit Note' : 'Your Notes'}
        </h1>

        {/* Note Heading Input */}
        <input
          type='text'
          placeholder='Enter Notes Heading'
          className='px-5 font-medium w-full py-2 border-2 outline-none rounded bg-transparent text-white'
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Updates title state on typing
        />

        {/* Note Details Textarea */}
        <textarea
          placeholder='Write Your Notes Here'
          className='px-5 font-medium w-full py-2 border-2 outline-none rounded bg-transparent text-white'
          value={details}
          onChange={(e) => setDetails(e.target.value)} // Updates details state on typing
        />

        {/* Action Buttons Container */}
        <div className='flex gap-2 w-full'>
          {/* Dynamic submit button text */}
          <button
            type='submit'
            className='bg-white font-medium active:scale-95 w-full outline-none text-black px-5 py-2 rounded transition-transform'
          >
            {editId !== null ? 'Update Note' : 'Add Note'}
          </button>

          {/* Show Cancel button only when in Edit Mode */}
          {editId !== null && (
            <button
              type='button'
              onClick={handleCancelEdit}
              className='bg-gray-700 font-medium active:scale-95 px-5 py-2 rounded text-white transition-transform'
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---------------------------------------------------------------------
          NOTES LIST SECTION (RIGHT PANEL)
         --------------------------------------------------------------------- */}
      <div className='lg:w-1/2 lg:border-l-2 bg-gray-900 p-10 overflow-y-auto'>
        <h1 className='text-3xl font-bold'>Your Notes</h1>

        <div className='flex flex-wrap items-start justify-start gap-5 mt-6'>
          {/* AnimatePresence enables exit animations when elements leave DOM */}
          <AnimatePresence>
            {task.map((elem) => (
              <motion.div
                key={elem.id} // Unique key required for Framer Motion and React
                layout // Smoothly repo-animates sibling elements when one is added/deleted
                initial={{ opacity: 0, scale: 0.8, y: 15 }} // Entry starting state
                animate={{ opacity: 1, scale: 1, y: 0 }}    // Entry target state
                exit={{ opacity: 0, scale: 0.8, y: -15 }}   // Exit animation on delete
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                
                // Highlights card with yellow border if it is currently being edited
                className={`flex h-52 w-40 flex-col overflow-hidden bg-repeat rounded-xl text-black py-4 px-4 bg-white bg-[url("https://www.transparenttextures.com/patterns/3px-tile.png")] ${
                  editId === elem.id ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                {/* Note Title */}
                <h3 className='line-clamp-2 break-words leading-tight text-xl font-bold'>
                  {elem.title}
                </h3>

                {/* Note Details */}
                <p className='mt-2 line-clamp-3 break-words leading-tight font-medium text-gray-700 overflow-hidden'>
                  {elem.details}
                </p>

                {/* Card Action Buttons (Pushed to bottom using mt-auto) */}
                <div className='mt-auto flex gap-2 w-full shrink-0'>
                  {/* Edit Button */}
                  <button
                    type='button'
                    onClick={() => handleEdit(elem)}
                    className='flex-1 cursor-pointer active:scale-95 bg-blue-500 py-1 text-xs rounded font-bold text-white transition-transform'
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    type='button'
                    onClick={() => deletNote(elem.id)}
                    className='flex-1 cursor-pointer active:scale-95 bg-red-500 py-1 text-xs rounded font-bold text-white transition-transform'
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default App