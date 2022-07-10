import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Select from "react-select";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [data, setdata] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchData, setsearchData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    fetch("https://randomuser.me/api/?results=20")
      .then((response) => response.json())
      .then((response) => {
        setdata(response.results);
      });
    parseData();
  };
  const parseData = () => {
    const completeData = [];
    data.forEach((details) => {
      completeData.push({
        id: details.id.value,
        content: details.name.first + " " + details.name.last,
        description: details.location.country,
      });
    });
    const search = [];
    completeData.map((element) => {
      search.push({ label: element.content, value: element.content });
    });
    setsearchData(search);
    const displayData = {
      Open: {
        name: "Open",
        items: completeData,
      },
      Contacted: {
        name: "Contacted",
        items: [],
      },
      "Written test": {
        name: "Written test",
        items: [],
      },
      "Technical round": {
        name: "Technical round",
        items: [],
      },
      "Culture fit round": {
        name: "Culture fit round",
        items: [],
      },
    };
    setColumns(displayData);
  };
  return (
    <>
      <div style={{ float: "right", width: "250px" }}>
        <Select options={searchData} />
      </div>
      <br />
      <br />
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h2>
                  {column.name}-{column.items.length}
                </h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            height: 500,
                            overflowY: "scroll",
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.content}
                                      <div>{item.description}</div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
