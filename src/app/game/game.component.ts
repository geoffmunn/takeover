import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { PoliticalSelection } from './political-selector/political-selector.component';
import { StabilitySelection } from './stability-selector/stability-selector.component';
import { PlayerService } from './services/player.service';
import { LeftService } from './services/left.service';
import { RightService } from './services/right.service';
import { BuildingsService } from './services/buildings.service';
import { GovtTypesService } from './services/govt-types.service';
import { StabilitlyTypesService } from './services/stabilitly-types.service';
import { GameMapComponent } from './game-map/game-map.component';
import { GameScoreComponent } from './game-score/game-score.component';
import { GamePopularityComponent } from './game-popularity/game-popularity.component';
import { GameRemainingMovesComponent } from './game-remaining-moves/game-remaining-moves.component';
import { GameMessageboxComponent } from './game-messagebox/game-messagebox.component';
//import { MessageBoxService } from './services/message-box.service';
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgIf, NgFor, PoliticalSelection, StabilitySelection, GameMapComponent, GameScoreComponent, GamePopularityComponent, GameRemainingMovesComponent, GameMessageboxComponent],
  templateUrl: 'game.component.html', 
  styleUrl: 'game.component.css',
  providers: [BuildingsService]
})

export class GameComponent{

  public user: PlayerService;
  public govt: PlayerService;
  public remainingMoves: number = 0;
  public message:string = '';

  public showHide = {
    'intro': true,
    'howToPlay': false,
    'theMap': false,
    'scenarios': false,
    'pickASide': false,
    'confirmation': false,
    'summary': false,
    'game': false
  };

  changeMoves($event:any){
    this.remainingMoves -= 1;
  }

  changeScore($event:any){
    this.user.score = $event['user']
    this.govt.score = $event['govt']
  }

  changePopularity($event:any){
    this.user.popularity = $event['user']
    this.govt.popularity = $event['govt']
  }

  changeMessage($event:any){
    this.message = $event
  }

  checkPoliticalSelections(){

    let left = new LeftService();
    let right = new RightService();

    if (this.govt!.politicalType != 0){
      if (this.user!.politicalType <= this.govt!.politicalType){
        this.user!.position = left;
        this.govt!.position = right;
      } else {
        this.user!.position = right;
        this.govt!.position = left;
      };
    };
  };

  registerUserPoliticalSelection(event:string) {
    this.user.politicalType = new GovtTypesService().govtTypes.get(event)!
    this.checkPoliticalSelections();
  };
  registerGovtPoliticalSelection(event:string) {
    this.govt.politicalType = new GovtTypesService().govtTypes.get(event)!;
    this.checkPoliticalSelections();
  };

  registerGovtStabilitySelection(event:string) {
    this.govt!.stability = new StabilitlyTypesService().stabilityTypes.get(event)!;

    /*
    ##### A = difficulty
    ##### G1 = the government type
    ##### P1 = the player type 
    6785 IFA<1ORA>5THEN6780
    6790 G2=(A-1)/2+1.5+ABS(3-G1)/2
    6795 P2=2.5+ABS(3-P1)/2:PRINT"ì"
    6900 RETURN
    7000 REM ****************
    */

    let govtPopularity: number = (this.govt!.stability - 1) / 2 + 1.5 + Math.abs(3 - this.govt!.politicalType) / 2
    let userPopularity: number = 2.5 + Math.abs(3 - this.user!.politicalType) / 2
    
    this.buildings.initialiseLiklihoods(userPopularity, this.user.politicalType, govtPopularity, this.govt.politicalType)
    this.user.popularity = userPopularity
    this.govt.popularity = govtPopularity
  };

  nextPage(nextDiv:string){
    for (let key in this.showHide) {
      //let value = this.showHide[key as keyof typeof this.showHide]
      
      if (key == nextDiv) {
        this.showHide[key as keyof typeof this.showHide] = true;
      } else {
        this.showHide[key as keyof typeof this.showHide] = false;
      }
    }
  };

  constructor(@Inject(BuildingsService) public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    this.user = new PlayerService();
    this.govt = new PlayerService();

    this.remainingMoves = 5;

    //this.changeMessage('Your turn - start the revolution!')
    //this.child.callMe('calling from the parent')
    
  }

}

