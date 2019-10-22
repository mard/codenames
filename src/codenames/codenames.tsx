import {
  IWorkItemFormService,
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

function toTitleCase(text:string) {
  return text.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

function getRandomOfArray(items:string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

var workItemFormService = SDK.getService<IWorkItemFormService>(
  WorkItemTrackingServiceIds.WorkItemFormService
);

interface WorkItemFormGroupComponentState {
  eventContent: string;
  nouns: string[][];
  adjectives_verbs: string[][];
  fieldName: string;
  info: string;
  isDisabled: boolean;
}

class WorkItemFormGroupComponent extends React.Component<{},  WorkItemFormGroupComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      eventContent: "",
      nouns: [],
      adjectives_verbs: [],
      fieldName: "",
      info: "",
      isDisabled: true
    };
  }

  public componentDidMount() {
    SDK.init().then(() => {
      this.load();
    });
  }
  
  public render(): JSX.Element {
    return (
    <div>
      { this.state.info && <div><span>{this.state.info}</span></div> }
      <Button
        className="codenames-button"
        text="🎲 Generate a codename"
        onClick={() => this.onClickSet()}
        disabled={this.state.isDisabled}
      />
    </div>
    )
  }

  private load()
  {
    var getNouns = getFetch("./../nouns.json");
    var getAdjectivesVerbs = getFetch("./../adjectives-verbs.json");
    var fieldName = SDK.getConfiguration().witInputs["CodenamesFieldName"];

    Promise.all([getNouns, getAdjectivesVerbs]).then(x => {
      if (x[0] && x[1])
      {
        this.state.nouns.push(x[0]);
        this.state.adjectives_verbs.push(x[1]);
        
        if (fieldName)
        {
          this.setState({ fieldName: fieldName });
          this.setState({ isDisabled: false });
        }
        else
        {
          this.setState({ info:
            "⚠️ It appears that Codenames doesn't know which field to update. " +
            "Make sure that the field name was set in custom control configuration."
          });
        }
      }
      else
      {
        this.setState({ info:
          "❌ Fatal error: There was a problem getting words definitions."
        });
      }
    });
  }

  private async onClickSet() {
    if (this.state.fieldName)
    {
      var wordFirst = toTitleCase(getRandomOfArray(this.state.adjectives_verbs[0]));
      var wordSecond = toTitleCase(getRandomOfArray(this.state.nouns[0]));

      workItemFormService.then(x => x.setFieldValue(this.state.fieldName, `${wordFirst} ${wordSecond}`));
    }
  }
}

ReactDOM.render(<WorkItemFormGroupComponent />, document.getElementById("root"));
