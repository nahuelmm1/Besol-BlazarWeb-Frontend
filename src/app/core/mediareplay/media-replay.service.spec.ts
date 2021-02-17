import { TestBed, inject } from '@angular/core/testing';

import { MediaReplayService } from './media-replay.service';

describe('MediaReplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaReplayService]
    });
  });

  it('should ...', inject([MediaReplayService], (service: MediaReplayService) => {
    expect(service).toBeTruthy();
  }));
});
