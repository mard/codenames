import {
  IWorkItemChangedArgs,
  IWorkItemFieldChangedArgs,
  IWorkItemFormService,
  IWorkItemLoadedArgs,
  WorkItemTrackingServiceIds
} from "azure-devops-extension-api/WorkItemTracking";
import * as SDK from "azure-devops-extension-sdk";
import { Button } from "azure-devops-ui/Button";
import * as React from "react";
import * as ReactDOM from "react-dom";

export const getFetch = async (request: RequestInfo): Promise<any> => {
  return new Promise(resolve => {
    fetch(request)
      .then(response => response.json())
      .then(body => {
        resolve(body);
      });
  });
};

function capitalizeFirstLetter(text:string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getRandomOfArray(items:string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

var output = console.log;

interface WorkItemFormGroupComponentState {
  eventContent: string;
  id: string;
  fields: string;
  nouns: string[][];
  adjectives_verbs: string[][];
}

class WorkItemFormGroupComponent extends React.Component<{},  WorkItemFormGroupComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      eventContent: "",
      id: "",
      fields: "",
      nouns: [],
      adjectives_verbs: []
    };
  }

  public componentDidMount() {
    SDK.init().then(() => {
      this.registerEvents();
    });
  }

  public render(): JSX.Element {
    return (
      <div>
        <Button
          className="sample-work-item-button"
          text="Click me to change title!"
          onClick={() => this.onClickSet()}
        />
        <Button
          className="sample-work-item-button"
          text="Click me to get id!"
          onClick={() => this.onClickGet()}
        />
        <Button
          className="sample-work-item-button"
          text="Get fields"
          onClick={() => this.onClickGetFields()}
        />
        <p>Hi there</p>
        <p><div className="sample-work-item-events">{this.state.eventContent}</div></p>
        <p><div className="sample-work-item-id">{this.state.id}</div></p>
        <p><div className="sample-work-item-id">{this.state.fields}</div></p>
      </div>
    );
  }

  private registerEvents() {
    SDK.register(SDK.getContributionId(), () => {
      return {
        // Called when the active work item is modified
        onFieldChanged: (args: IWorkItemFieldChangedArgs) => {
          this.setState({
            eventContent: `onFieldChanged - ${JSON.stringify(args)}`
          });
          output(JSON.stringify(this.state));
        },

        // Called when a new work item is being loaded in the UI
        onLoaded: (args: IWorkItemLoadedArgs) => {
          this.setState({
            eventContent: `onLoaded - ${JSON.stringify(args)}`
          });

          getFetch("./../nouns.json").then(x => this.state.nouns.push(x));
          getFetch("./../adjectives-verbs.json").then(x => this.state.adjectives_verbs.push(x));
        },

        // Called when the active work item is being unloaded in the UI
        onUnloaded: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onUnloaded - ${JSON.stringify(args)}`
          });
          output(JSON.stringify(this.state));
        },

        // Called after the work item has been saved
        onSaved: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onSaved - ${JSON.stringify(args)}`
          });
          output(JSON.stringify(this.state));
        },

        // Called when the work item is reset to its unmodified state (undo)
        onReset: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onReset - ${JSON.stringify(args)}`
          });
          output(JSON.stringify(this.state));
        },

        // Called when the work item has been refreshed from the server
        onRefreshed: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onRefreshed - ${JSON.stringify(args)}`
          });
          output(JSON.stringify(this.state));
        }
      };
    });
  }

  private async onClickSet() {
    const workItemFormService = await SDK.getService<IWorkItemFormService>(
      WorkItemTrackingServiceIds.WorkItemFormService
    );

    var wordFirst = capitalizeFirstLetter(getRandomOfArray(this.state.adjectives_verbs[0]));
    var wordSecond = capitalizeFirstLetter(getRandomOfArray(this.state.nouns[0]));

    workItemFormService.setFieldValue(
      "Custom.Codenames", `${wordFirst} ${wordSecond}`
    );
  }



  private async onClickGet() {
    const workItemFormService = await SDK.getService<IWorkItemFormService>(
      WorkItemTrackingServiceIds.WorkItemFormService
    );
    
    //const workItemId = (await workItemFormService.getFieldValue('System.Id')) as string;
    //this.setState({id: `id is ${workItemId}`})
    //output(JSON.stringify(this.state));
  }

  private async onClickGetFields() {
    const workItemFormService = await SDK.getService<IWorkItemFormService>(
      WorkItemTrackingServiceIds.WorkItemFormService
    );
    const data = (await workItemFormService.getFields());
    this.setState({fields: `Fields are ${JSON.stringify(data)}`})
    output(JSON.stringify(this.state));

    const witinputs = (await SDK.getConfiguration());
    output("witinputs" + JSON.stringify(witinputs));
  }
}

ReactDOM.render(<WorkItemFormGroupComponent />, document.getElementById("root"));
